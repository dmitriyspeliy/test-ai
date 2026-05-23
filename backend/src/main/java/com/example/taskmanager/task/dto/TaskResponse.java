package com.example.taskmanager.task.dto;

import com.example.taskmanager.task.Task;
import com.example.taskmanager.task.attachment.TaskAttachmentResponse;
import com.example.taskmanager.task.TaskStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDate deadline,
        List<TaskAttachmentResponse> attachments,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static TaskResponse from(Task task) {
        return from(task, List.of());
    }

    public static TaskResponse from(Task task, List<TaskAttachmentResponse> attachments) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDeadline(),
                attachments,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
