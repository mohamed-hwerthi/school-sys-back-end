package com.schoolSys.schooolSys.vitrine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitrinePageDTO {

    private Long id;
    private String title;
    private String slug;
    private int displayOrder;
    private boolean visible;
    private List<VitrineSectionDTO> sections;
}
