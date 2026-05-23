import { FormEvent } from "react";

type TaskFormProps = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TaskForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit
}: TaskFormProps) {
  return (
    <form className="taskForm" onSubmit={onSubmit}>
      <label className="field">
        Title
        <input
          className="input"
          maxLength={200}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="New task"
          required
          value={title}
        />
      </label>
      <label className="field">
        Description
        <textarea
          className="textarea"
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Optional notes"
          value={description}
        />
      </label>
      <button className="primaryButton" type="submit">
        Add task
      </button>
    </form>
  );
}
