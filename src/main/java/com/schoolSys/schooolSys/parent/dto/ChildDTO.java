package com.schoolSys.schooolSys.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String classe;
    private String niveau;
    private String matricule;
}
