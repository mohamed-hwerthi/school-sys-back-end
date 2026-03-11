package com.schoolSys.schooolSys.auth.dto;

import com.schoolSys.schooolSys.auth.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserResponseDTO user;
}
