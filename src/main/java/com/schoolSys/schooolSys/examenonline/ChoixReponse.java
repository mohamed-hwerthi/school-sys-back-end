package com.schoolSys.schooolSys.examenonline;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "choix_reponse")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChoixReponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Question question;

    @Column(nullable = false, length = 500)
    private String texte;

    @Column
    @Builder.Default
    private Boolean correct = false;

    @Column(nullable = false)
    private Integer ordre;
}
