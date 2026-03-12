package com.schoolSys.schooolSys.examenonline;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "reponses_eleve")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReponseEleve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tentative_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Tentative tentative;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "choix_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ChoixReponse choix;

    @Column(name = "reponse_texte", columnDefinition = "TEXT")
    private String reponseTexte;

    @Column
    private Boolean correct;

    @Column(name = "points_obtenus", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal pointsObtenus = BigDecimal.ZERO;
}
