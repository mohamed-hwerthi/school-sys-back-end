package com.schoolSys.schooolSys.note.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CompetenceDTO {
    private Long id;
    private Long moduleId;
    private String label;
    private String description;
}
