package com.schoolSys.schooolSys.tenant.dto;

import lombok.Data;

@Data
public class TenantOnboardingRequest {

    private String schoolName;
    private String slug;
    private String adminFirstName;
    private String adminLastName;
    private String adminEmail;
    private String adminPassword;
    private String plan;
    private String contactPhone;
}
