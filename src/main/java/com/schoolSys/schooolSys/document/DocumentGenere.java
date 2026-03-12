package com.schoolSys.schooolSys.document;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents_generes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentGenere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_document", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TypeDocument typeDocument;

    @Column(name = "eleve_id")
    private Long eleveId;

    @Column(name = "file_name", nullable = false, length = 300)
    private String fileName;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "genere_par", length = 200)
    private String generePar;

    @Column(name = "annee_scolaire", length = 20)
    private String anneeScolaire;

    @Column
    private Integer trimestre;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TypeDocument {
        CERTIFICAT_SCOLARITE,
        CARTE_SCOLAIRE,
        ATTESTATION_REUSSITE,
        RELEVE_NOTES,
        RECU_PAIEMENT
    }
}
