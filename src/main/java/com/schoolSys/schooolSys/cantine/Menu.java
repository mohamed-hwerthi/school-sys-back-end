package com.schoolSys.schooolSys.cantine;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "menus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_menu", nullable = false)
    private LocalDate dateMenu;

    @Column(name = "jour_semaine", nullable = false, length = 10)
    private String jourSemaine;

    @Column(length = 300)
    private String entree;

    @Column(name = "plat_principal", nullable = false, length = 300)
    private String platPrincipal;

    @Column(length = 300)
    private String accompagnement;

    @Column(length = 300)
    private String dessert;

    @Column(name = "allergenes", columnDefinition = "TEXT[]")
    private String[] allergenes;

    @Column(name = "type_regime", length = 20)
    @Builder.Default
    private String typeRegime = "STANDARD";

    @Column
    private Integer semaine;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
