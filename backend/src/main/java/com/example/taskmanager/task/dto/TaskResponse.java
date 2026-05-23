package com.example.taskmanager.task.dto;

import com.example.taskmanager.task.Task;
import com.example.taskmanager.task.TaskStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDate deadline,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDeadline(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
