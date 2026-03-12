package com.schoolSys.schooolSys.messaging;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.messaging.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessagingService {

    private final MessageRepository messageRepository;
    private final MessageRecipientRepository messageRecipientRepository;

    @Transactional
    public MessageResponseDTO sendMessage(MessageRequestDTO request) {
        Message message = Message.builder()
            .senderId(request.getSenderId())
            .subject(request.getSubject())
            .body(request.getBody())
            .type(request.getType() != null ? request.getType() : "MESSAGE")
            .build();

        List<MessageRecipient> recipients = request.getRecipientIds().stream()
            .map(recipientId -> MessageRecipient.builder()
                .message(message)
                .recipientId(recipientId)
                .build())
            .collect(Collectors.toList());

        message.getRecipients().addAll(recipients);
        return toDto(messageRepository.save(message));
    }

    public List<MessageResponseDTO> getInbox(Long recipientId) {
        return messageRecipientRepository
            .findByRecipientIdAndDeletedFalseOrderByMessageCreatedAtDesc(recipientId)
            .stream()
            .map(mr -> toDto(mr.getMessage()))
            .collect(Collectors.toList());
    }

    public List<MessageResponseDTO> getSent(Long senderId) {
        return messageRepository.findBySenderIdOrderByCreatedAtDesc(senderId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public MessageResponseDTO getMessageById(Long id) {
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Message", id));
        return toDto(message);
    }

    @Transactional
    public void markAsRead(Long messageId, Long recipientId) {
        MessageRecipient mr = messageRecipientRepository
            .findByMessageIdAndRecipientId(messageId, recipientId)
            .orElseThrow(() -> new ResourceNotFoundException("MessageRecipient", messageId));
        if (mr.getReadAt() == null) {
            mr.setReadAt(LocalDateTime.now());
            messageRecipientRepository.save(mr);
        }
    }

    @Transactional
    public void deleteForRecipient(Long messageId, Long recipientId) {
        MessageRecipient mr = messageRecipientRepository
            .findByMessageIdAndRecipientId(messageId, recipientId)
            .orElseThrow(() -> new ResourceNotFoundException("MessageRecipient", messageId));
        mr.setDeleted(true);
        messageRecipientRepository.save(mr);
    }

    private MessageResponseDTO toDto(Message m) {
        List<MessageResponseDTO.RecipientDTO> recipients = m.getRecipients().stream()
            .map(mr -> MessageResponseDTO.RecipientDTO.builder()
                .id(mr.getId())
                .recipientId(mr.getRecipientId())
                .readAt(mr.getReadAt())
                .deleted(mr.getDeleted())
                .build())
            .collect(Collectors.toList());

        return MessageResponseDTO.builder()
            .id(m.getId())
            .senderId(m.getSenderId())
            .subject(m.getSubject())
            .body(m.getBody())
            .type(m.getType())
            .recipients(recipients)
            .createdAt(m.getCreatedAt())
            .build();
    }
}
