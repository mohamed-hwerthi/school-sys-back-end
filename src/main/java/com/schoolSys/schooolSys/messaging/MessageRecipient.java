package com.schoolSys.schooolSys.messaging;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "message_recipients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Message message;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;
}
