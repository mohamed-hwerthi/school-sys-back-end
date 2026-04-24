package com.schoolSys.schooolSys.classroom;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

/**
 * JPA entity representing a physical classroom in a school.
 */
@Entity
@Table(name = "classrooms")
@SQLDelete(sql = "UPDATE classrooms SET deleted = true, deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer capacity;

    private String location;

    @Column(length = 50)
    private String type;

    private Integer floor;

    @Column(columnDefinition = "TEXT")
    private String equipment;

    @Column(length = 30)
    private String status;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
