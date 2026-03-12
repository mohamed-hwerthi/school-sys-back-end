package com.schoolSys.schooolSys.messaging.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long senderId;
    private String subject;
    private String body;
    private String type;
    private List<RecipientDTO> recipients;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipientDTO {
        private Long id;
        private Long recipientId;
        private LocalDateTime readAt;
        private Boolean deleted;
    }
}
