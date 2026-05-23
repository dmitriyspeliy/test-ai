package com.example.taskmanager.task.attachment;

import java.util.UUID;

public class TaskAttachmentNotFoundException extends RuntimeException {

    public TaskAttachmentNotFoundException(Long taskId, UUID attachmentId) {
        super("Task attachment not found: taskId=" + taskId + ", attachmentId=" + attachmentId);
    }
}
