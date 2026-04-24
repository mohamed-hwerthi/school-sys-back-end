package com.schoolSys.schooolSys.discipline;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_eleves")
@SQLDelete(sql = "UPDATE incident_eleves SET deleted = true, deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentEleve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Incident incident;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(length = 20)
    private String roleEleve; // AUTEUR, VICTIME, TEMOIN

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
