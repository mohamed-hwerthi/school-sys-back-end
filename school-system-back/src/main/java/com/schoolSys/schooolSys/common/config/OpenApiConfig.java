package com.schoolSys.schooolSys.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.media.StringSchema;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration.
 * <p>
 * Swagger UI is available at: <a href="http://localhost:8080/swagger-ui.html">/swagger-ui.html</a><br>
 * API docs JSON at: <a href="http://localhost:8080/v3/api-docs">/v3/api-docs</a>
 * </p>
 */
@Configuration
public class OpenApiConfig {

    /**
     * Configures the OpenAPI metadata displayed in Swagger UI.
     *
     * @return the OpenAPI definition
     */
    @Bean
    public OpenAPI schoolSystemOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("School Management System API")
                        .description("""
                                Multi-tenant school management system.
                                Each school has its own PostgreSQL schema.

                                **Usage:** Include the `X-Tenant-ID` header with the school's schema name
                                on all endpoints except `/api/tenants`.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("School System Team")));
    }

    /**
     * Adds the {@code X-Tenant-ID} header parameter to every operation
     * so it appears in Swagger UI for easy testing.
     *
     * @return the operation customizer
     */
    @Bean
    public OperationCustomizer tenantHeaderCustomizer() {
        return (operation, handlerMethod) -> {
            String path = handlerMethod.getMethod().getDeclaringClass().getPackageName();
            // Skip tenant header for tenant management endpoints
            if (!path.contains(".tenant")) {
                operation.addParametersItem(
                        new Parameter()
                                .in("header")
                                .name("X-Tenant-ID")
                                .description("School schema name (e.g. school_abc)")
                                .required(true)
                                .schema(new StringSchema()));
            }
            return operation;
        };
    }
}
