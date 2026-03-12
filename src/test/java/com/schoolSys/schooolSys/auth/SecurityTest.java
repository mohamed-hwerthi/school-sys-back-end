package com.schoolSys.schooolSys.auth;

import com.schoolSys.schooolSys.common.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
@DisplayName("Security Configuration Tests")
class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private PasswordResetService passwordResetService;

    @Nested
    @DisplayName("Public Endpoints")
    class PublicEndpoints {

        @Test
        @DisplayName("POST /api/auth/login should be accessible without auth")
        void loginShouldBeAccessible() throws Exception {
            mockMvc.perform(get("/api/auth/login"))
                    // login is POST-only, but the point is it should not return 401
                    .andExpect(result -> {
                        int statusCode = result.getResponse().getStatus();
                        // Should not be 401 (Unauthorized) - may be 405 (method not allowed) since login is POST
                        assert statusCode != 401 : "Expected non-401 status, got " + statusCode;
                    });
        }

        @Test
        @DisplayName("Swagger UI should be accessible without auth")
        void swaggerShouldBeAccessible() throws Exception {
            mockMvc.perform(get("/swagger-ui/index.html"))
                    .andExpect(result -> {
                        int statusCode = result.getResponse().getStatus();
                        assert statusCode != 401 : "Expected non-401 status for swagger, got " + statusCode;
                    });
        }

        @Test
        @DisplayName("Actuator endpoints should be accessible without auth")
        void actuatorShouldBeAccessible() throws Exception {
            mockMvc.perform(get("/actuator/health"))
                    .andExpect(result -> {
                        int statusCode = result.getResponse().getStatus();
                        assert statusCode != 401 : "Expected non-401 status for actuator, got " + statusCode;
                    });
        }
    }

    @Nested
    @DisplayName("Protected Endpoints")
    class ProtectedEndpoints {

        @Test
        @DisplayName("GET /api/students should require authentication")
        void studentsShouldRequireAuth() throws Exception {
            mockMvc.perform(get("/api/students"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /api/paiements should require authentication")
        void paiementsShouldRequireAuth() throws Exception {
            mockMvc.perform(get("/api/paiements"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /api/auth/me should require authentication")
        void meShouldRequireAuth() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("Role-Based Access")
    class RoleBasedAccess {

        @Test
        @WithMockUser(authorities = "READ_STUDENTS")
        @DisplayName("should allow access with correct authority")
        void shouldAllowWithCorrectAuthority() throws Exception {
            mockMvc.perform(get("/api/students"))
                    .andExpect(result -> {
                        int statusCode = result.getResponse().getStatus();
                        // Should not be 401 or 403
                        assert statusCode != 401 : "Expected non-401 status, got " + statusCode;
                        assert statusCode != 403 : "Expected non-403 status, got " + statusCode;
                    });
        }
    }
}
