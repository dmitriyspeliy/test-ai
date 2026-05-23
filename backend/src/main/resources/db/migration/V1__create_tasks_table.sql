CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE tasks IS 'Tasks managed by the local task manager application.';

COMMENT ON COLUMN tasks.id IS 'Primary key for a task.';
COMMENT ON COLUMN tasks.title IS 'Short task title displayed in the task list.';
COMMENT ON COLUMN tasks.description IS 'Optional longer task description.';
COMMENT ON COLUMN tasks.status IS 'Current task status, such as TODO or DONE.';
COMMENT ON COLUMN tasks.created_at IS 'Timestamp when the task was created.';
COMMENT ON COLUMN tasks.updated_at IS 'Timestamp when the task was last updated.';

CREATE INDEX IF NOT EXISTS idx_tasks_created_at_desc ON tasks (created_at DESC);
