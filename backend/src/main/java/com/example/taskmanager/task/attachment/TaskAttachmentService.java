package com.example.taskmanager.task.attachment;

import com.example.taskmanager.task.Task;
import com.example.taskmanager.task.TaskNotFoundException;
import com.example.taskmanager.task.TaskRepository;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TaskAttachmentService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/heif"
    );

    private final TaskRepository taskRepository;
    private final TaskAttachmentRepository taskAttachmentRepository;
    private final long maxFileSizeBytes;
    private final int maxFilesPerTask;

    public TaskAttachmentService(
            TaskRepository taskRepository,
            TaskAttachmentRepository taskAttachmentRepository,
            @Value("${app.uploads.max-file-size-bytes}") long maxFileSizeBytes,
            @Value("${app.uploads.max-files-per-task}") int maxFilesPerTask
    ) {
        this.taskRepository = taskRepository;
        this.taskAttachmentRepository = taskAttachmentRepository;
        this.maxFileSizeBytes = maxFileSizeBytes;
        this.maxFilesPerTask = maxFilesPerTask;
    }

    @Transactional(readOnly = true)
    public List<TaskAttachmentResponse> findMetadata(Long taskId) {
        return taskAttachmentRepository.findByTaskIdOrderByCreatedAtAsc(taskId).stream()
                .map(TaskAttachmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<Long, List<TaskAttachmentResponse>> findMetadataByTaskIds(Collection<Long> taskIds) {
        if (taskIds.isEmpty()) {
            return Map.of();
        }
        return taskAttachmentRepository.findByTaskIdInOrderByCreatedAtAsc(taskIds).stream()
                .collect(Collectors.groupingBy(
                        attachment -> attachment.getTask().getId(),
                        Collectors.mapping(TaskAttachmentResponse::from, Collectors.toList())
                ));
    }

    @Transactional
    public List<TaskAttachmentResponse> upload(Long taskId, MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new InvalidTaskAttachmentException("At least one file is required.");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        long existingCount = taskAttachmentRepository.countByTaskId(taskId);
        if (existingCount + files.length > maxFilesPerTask) {
            throw new InvalidTaskAttachmentException("Too many files for this task.");
        }

        List<TaskAttachment> attachments = List.of(files).stream()
                .map(file -> buildAttachment(task, file))
                .toList();

        return taskAttachmentRepository.saveAll(attachments).stream()
                .map(TaskAttachmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskAttachment getAttachment(Long taskId, UUID attachmentId) {
        return taskAttachmentRepository.findByIdAndTaskId(attachmentId, taskId)
                .orElseThrow(() -> new TaskAttachmentNotFoundException(taskId, attachmentId));
    }

    private TaskAttachment buildAttachment(Task task, MultipartFile file) {
        validate(file);
        try {
            return new TaskAttachment(
                    task,
                    cleanFileName(file.getOriginalFilename()),
                    file.getContentType(),
                    file.getSize(),
                    file.getBytes()
            );
        } catch (IOException exception) {
            throw new InvalidTaskAttachmentException("Could not read uploaded file.");
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidTaskAttachmentException("File is empty.");
        }
        if (file.getSize() > maxFileSizeBytes) {
            throw new InvalidTaskAttachmentException("File is too large.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new InvalidTaskAttachmentException("Unsupported file type.");
        }
        if (cleanFileName(file.getOriginalFilename()).length() > 255) {
            throw new InvalidTaskAttachmentException("File name is too long.");
        }
    }

    private String cleanFileName(String originalFileName) {
        String fileName = StringUtils.cleanPath(originalFileName == null ? "photo" : originalFileName);
        return fileName.isBlank() ? "photo" : fileName;
    }
}
