package com.schoolSys.schooolSys.classroom;

import jakarta.persistence.*;
import lombok.*;

/**
 * JPA entity representing a physical classroom in a school.
 */
@Entity
@Table(name = "classrooms")
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
}
