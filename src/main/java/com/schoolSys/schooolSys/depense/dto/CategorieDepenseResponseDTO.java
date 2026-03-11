package com.schoolSys.schooolSys.depense.dto;

import com.schoolSys.schooolSys.depense.CategorieDepense;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CategorieDepenseResponseDTO {

    private Long id;
    private String nom;
    private CategorieDepense.TypeCategorie type;
    private String description;
    private LocalDateTime createdAt;
}
