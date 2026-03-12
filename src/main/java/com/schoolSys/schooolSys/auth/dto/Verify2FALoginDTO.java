package com.schoolSys.schooolSys.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Verify2FALoginDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Code is required")
    @Size(min = 6, max = 6, message = "Code must be 6 digits")
    private String code;
}
