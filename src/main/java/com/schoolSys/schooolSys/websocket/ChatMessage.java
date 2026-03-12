package com.schoolSys.schooolSys.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for real-time chat messages sent via WebSocket.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private Long senderId;

    private String senderName;

    private Long recipientId;

    private String content;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @Builder.Default
    private MessageType type = MessageType.TEXT;

    public enum MessageType {
        TEXT,
        SYSTEM
    }
}
