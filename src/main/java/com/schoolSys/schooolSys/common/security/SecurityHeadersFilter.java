package com.schoolSys.schooolSys.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Adds standard security headers to every HTTP response.
 * <p>
 * Headers set:
 * <ul>
 *   <li><b>X-Content-Type-Options</b>: nosniff</li>
 *   <li><b>X-Frame-Options</b>: DENY</li>
 *   <li><b>X-XSS-Protection</b>: 1; mode=block</li>
 *   <li><b>Strict-Transport-Security</b>: max-age=31536000; includeSubDomains</li>
 *   <li><b>Content-Security-Policy</b>: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'</li>
 *   <li><b>Referrer-Policy</b>: strict-origin-when-cross-origin</li>
 * </ul>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.setHeader("Content-Security-Policy",
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        filterChain.doFilter(request, response);
    }
}
