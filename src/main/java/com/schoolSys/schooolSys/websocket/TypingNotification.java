package com.schoolSys.schooolSys.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for typing indicator notifications sent via WebSocket.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingNotification {

    private Long senderId;

    private String senderName;

    private Long recipientId;

    private boolean typing;
}
