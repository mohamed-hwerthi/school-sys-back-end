package com.schoolSys.schooolSys.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRecipientRepository extends JpaRepository<MessageRecipient, Long> {

    List<MessageRecipient> findByRecipientIdAndDeletedFalseOrderByMessageCreatedAtDesc(Long recipientId);

    Optional<MessageRecipient> findByMessageIdAndRecipientId(Long messageId, Long recipientId);
}
