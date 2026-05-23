package com.example.taskmanager.task.attachment;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, UUID> {

    List<TaskAttachment> findByTaskIdOrderByCreatedAtAsc(Long taskId);

    List<TaskAttachment> findByTaskIdInOrderByCreatedAtAsc(Collection<Long> taskIds);

    Optional<TaskAttachment> findByIdAndTaskId(UUID id, Long taskId);

    long countByTaskId(Long taskId);
}
