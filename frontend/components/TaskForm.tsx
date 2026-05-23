import { FormEvent } from "react";

type TaskFormProps = {
  title: string;
  description: string;
  deadline: string;
  photos: File[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
  onPhotosChange: (files: File[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TaskForm({
  title,
  description,
  deadline,
  photos,
  onTitleChange,
  onDescriptionChange,
  onDeadlineChange,
  onPhotosChange,
  onSubmit
}: TaskFormProps) {
  return (
    <form className="taskForm" onSubmit={onSubmit}>
      <label className="field">
        Название
        <input
          className="input"
          maxLength={200}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Новая задача"
          required
          value={title}
        />
      </label>
      <label className="field">
        Описание
        <textarea
          className="textarea"
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Дополнительное описание"
          value={description}
        />
      </label>
      <label className="field">
        Дедлайн
        <input
          className="input"
          onChange={(event) => onDeadlineChange(event.target.value)}
          type="date"
          value={deadline}
        />
      </label>
      <label className="field">
        Фото
        <input
          accept="image/*"
          className="input fileInput"
          key={photos.length === 0 ? "empty" : "selected"}
          multiple
          onChange={(event) => onPhotosChange(Array.from(event.target.files ?? []))}
          type="file"
        />
        <span className="fieldHint">
          {photos.length > 0 ? `Выбрано фото: ${photos.length}` : "Фото не прикреплены"}
        </span>
      </label>
      <button className="primaryButton" type="submit">
        Добавить задачу
      </button>
    </form>
  );
}
