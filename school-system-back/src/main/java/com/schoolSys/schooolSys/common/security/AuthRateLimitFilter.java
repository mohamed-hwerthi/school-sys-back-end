package com.schoolSys.schooolSys.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory, per-IP rate limiter for the brute-forceable authentication
 * endpoints (login, password reset, 2FA verification).
 * <p>
 * Fixed window of {@link #WINDOW_SECONDS} seconds, {@link #MAX_REQUESTS}
 * requests per IP. Beyond the limit the request is rejected with HTTP 429.
 * This is a per-instance net that complements the per-account lockout
 * (see {@code LoginAttemptService}); it is not distributed.
 * </p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class AuthRateLimitFilter extends OncePerRequestFilter {

    /** Max requests allowed per IP within one window. */
    private static final int MAX_REQUESTS = 20;

    /** Length of the fixed rate-limiting window, in seconds. */
    private static final long WINDOW_SECONDS = 60;

    /** Above this many tracked IPs, expired entries are swept on access. */
    private static final int CLEANUP_THRESHOLD = 5_000;

    /** Endpoints protected against brute force (all POST). */
    private static final Set<String> RATE_LIMITED_PATHS = Set.of(
            "/api/auth/login",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/auth/2fa/verify");

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod())
                || !RATE_LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String ip = clientIp(request);
        if (isOverLimit(ip)) {
            log.warn("Rate limit depasse pour {} sur {}", ip, request.getRequestURI());
            writeTooManyRequests(request, response);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean isOverLimit(String ip) {
        Instant now = Instant.now();
        if (windows.size() > CLEANUP_THRESHOLD) {
            windows.values().removeIf(w -> w.isExpired(now));
        }
        Window window = windows.compute(ip, (key, current) -> {
            if (current == null || current.isExpired(now)) {
                return new Window(now);
            }
            current.count.incrementAndGet();
            return current;
        });
        return window.count.get() > MAX_REQUESTS;
    }

    private void writeTooManyRequests(HttpServletRequest request,
                                      HttpServletResponse response) throws IOException {
        response.setStatus(429);
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Retry-After", String.valueOf(WINDOW_SECONDS));
        // Echo the Origin so the browser can read the 429 instead of a CORS error.
        String origin = request.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }
        response.getWriter().write(
                "{\"success\":false,\"data\":null,"
                        + "\"message\":\"Trop de tentatives. Reessayez dans une minute.\"}");
    }

    private String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        return request.getRemoteAddr();
    }

    /** A fixed time window with its request counter. */
    private static final class Window {
        private final Instant startedAt;
        private final AtomicInteger count = new AtomicInteger(1);

        private Window(Instant startedAt) {
            this.startedAt = startedAt;
        }

        private boolean isExpired(Instant now) {
            return startedAt.plusSeconds(WINDOW_SECONDS).isBefore(now);
        }
    }
}
