package com.schoolSys.schooolSys.finance.dto;

import com.schoolSys.schooolSys.finance.MouvementCaisse;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MouvementCaisseResponseDTO {
    private Long id;
    private Long caisseId;
    private MouvementCaisse.TypeMouvement type;
    private MouvementCaisse.CategorieMouvement categorie;
    private BigDecimal montant;
    private String libelle;
    private String referencePaiement;
    private String notes;
    private LocalDateTime createdAt;
}
