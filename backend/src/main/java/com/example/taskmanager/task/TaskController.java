package com.example.taskmanager.task;

import com.example.taskmanager.task.dto.CreateTaskRequest;
import com.example.taskmanager.task.dto.TaskResponse;
import com.example.taskmanager.task.dto.UpdateTaskStatusRequest;
import com.example.taskmanager.task.attachment.InvalidTaskAttachmentException;
import com.example.taskmanager.task.attachment.TaskAttachment;
import com.example.taskmanager.task.attachment.TaskAttachmentNotFoundException;
import com.example.taskmanager.task.attachment.TaskAttachmentResponse;
import com.example.taskmanager.task.attachment.TaskAttachmentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskAttachmentService taskAttachmentService;

    public TaskController(TaskService taskService, TaskAttachmentService taskAttachmentService) {
        this.taskService = taskService;
        this.taskAttachmentService = taskAttachmentService;
    }

    @GetMapping
    public List<TaskResponse> findAll() {
        List<Task> tasks = taskService.findAll();
        Map<Long, List<TaskAttachmentResponse>> attachmentsByTaskId = taskAttachmentService.findMetadataByTaskIds(
                tasks.stream().map(Task::getId).toList()
        );
        return tasks.stream()
                .map(task -> TaskResponse.from(task, attachmentsByTaskId.getOrDefault(task.getId(), List.of())))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest request) {
        Task task = taskService.create(request.title(), request.description(), request.deadline());
        return TaskResponse.from(task);
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskStatusRequest request
    ) {
        Task task = taskService.updateStatus(id, request.status());
        return TaskResponse.from(task, taskAttachmentService.findMetadata(task.getId()));
    }

    @PostMapping(path = "/{taskId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<TaskAttachmentResponse>> uploadAttachments(
            @PathVariable Long taskId,
            @RequestParam("files") MultipartFile[] files
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskAttachmentService.upload(taskId, files));
    }

    @GetMapping("/{taskId}/attachments/{attachmentId}")
    public ResponseEntity<ByteArrayResource> getAttachment(
            @PathVariable Long taskId,
            @PathVariable UUID attachmentId
    ) {
        TaskAttachment attachment = taskAttachmentService.getAttachment(taskId, attachmentId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .contentLength(attachment.getSizeBytes())
                .headers(headers -> headers.setContentDisposition(ContentDisposition.inline()
                        .filename(attachment.getOriginalFileName())
                        .build()))
                .body(new ByteArrayResource(attachment.getData()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Void> handleNotFound() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(TaskAttachmentNotFoundException.class)
    public ResponseEntity<Void> handleAttachmentNotFound() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(InvalidTaskAttachmentException.class)
    public ResponseEntity<Void> handleInvalidAttachment() {
        return ResponseEntity.badRequest().build();
    }
}
