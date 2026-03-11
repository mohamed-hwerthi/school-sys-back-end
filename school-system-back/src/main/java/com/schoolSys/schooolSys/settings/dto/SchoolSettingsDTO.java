package com.schoolSys.schooolSys.settings.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchoolSettingsDTO {
    private String schoolName;
    private String schoolNameAr;
    private String anneeScolaire;
    private String adresse;
    private String telephone;
    private String directeurName;
    private String directeurNameAr;
}
