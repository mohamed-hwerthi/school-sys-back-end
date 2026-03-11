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
public class UserResponseDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String tenantId;
    private Boolean isActive;
}
