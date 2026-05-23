CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY,
    task_id BIGINT NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    data BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_task_attachments_task_id
        FOREIGN KEY (task_id)
        REFERENCES tasks (id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments (task_id);

COMMENT ON TABLE task_attachments IS 'Photos attached to tasks and stored directly in PostgreSQL.';
COMMENT ON COLUMN task_attachments.id IS 'Primary key for a task attachment.';
COMMENT ON COLUMN task_attachments.task_id IS 'Identifier of the task this attachment belongs to.';
COMMENT ON COLUMN task_attachments.original_file_name IS 'Original file name provided by the user.';
COMMENT ON COLUMN task_attachments.content_type IS 'MIME type of the uploaded image.';
COMMENT ON COLUMN task_attachments.size_bytes IS 'Attachment size in bytes.';
COMMENT ON COLUMN task_attachments.data IS 'Raw image binary data stored in PostgreSQL.';
COMMENT ON COLUMN task_attachments.created_at IS 'Timestamp when the attachment was uploaded.';
