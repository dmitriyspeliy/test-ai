package com.example.taskmanager.task.attachment;

import java.util.UUID;

public record TaskAttachmentResponse(
        UUID id,
        String originalFileName,
        String contentType,
        Long sizeBytes,
        String url
) {

    public static TaskAttachmentResponse from(TaskAttachment attachment) {
        Long taskId = attachment.getTask().getId();
        UUID attachmentId = attachment.getId();
        return new TaskAttachmentResponse(
                attachmentId,
                attachment.getOriginalFileName(),
                attachment.getContentType(),
                attachment.getSizeBytes(),
                "/api/tasks/" + taskId + "/attachments/" + attachmentId
        );
    }
}
