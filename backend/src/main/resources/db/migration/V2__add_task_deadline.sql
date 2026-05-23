ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS deadline DATE;

COMMENT ON COLUMN tasks.deadline IS 'Optional date when the task should be completed.';
