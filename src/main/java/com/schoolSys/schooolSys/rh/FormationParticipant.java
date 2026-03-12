package com.schoolSys.schooolSys.rh;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "formation_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;

    @Column(name = "employe_id", nullable = false)
    private Long employeId;

    @Column(name = "employe_type", nullable = false, length = 20)
    private String employeType;

    @Builder.Default
    private Boolean present = false;

    @Column(name = "certificat_obtenu")
    @Builder.Default
    private Boolean certificatObtenu = false;
}
