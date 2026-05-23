"use client";

import { FormEvent, useEffect, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTaskStatus, uploadTaskAttachments } from "../lib/api";
import { Task, TaskStatus } from "../types/task";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const maxPhotoSizeBytes = 10 * 1024 * 1024;
  const maxPhotos = 10;
  const allowedPhotoTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif"
  ]);

  async function loadTasks() {
    setError(null);
    try {
      setTasks(await fetchTasks());
    } catch {
      setError("Не удалось загрузить задачи.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    const photoValidationError = validatePhotos(photos);
    if (photoValidationError) {
      setError(photoValidationError);
      return;
    }

    setError(null);
    try {
      const task = await createTask({
        title: trimmedTitle,
        description: description.trim() || null,
        deadline: deadline || null
      });
      if (photos.length > 0) {
        await uploadTaskAttachments(task.id, photos);
      }
      await loadTasks();
      setTitle("");
      setDescription("");
      setDeadline("");
      setPhotos([]);
    } catch {
      setError(photos.length > 0 ? "Не удалось загрузить фото." : "Не удалось добавить задачу.");
    }
  }

  function validatePhotos(files: File[]): string | null {
    if (files.length > maxPhotos) {
      return `Можно прикрепить не больше ${maxPhotos} фото.`;
    }
    if (files.some((file) => file.size > maxPhotoSizeBytes)) {
      return "Файл слишком большой.";
    }
    if (files.some((file) => !allowedPhotoTypes.has(file.type))) {
      return "Недопустимый формат файла.";
    }
    return null;
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    setError(null);
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
    } catch {
      setError("Не удалось обновить задачу.");
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch {
      setError("Не удалось удалить задачу.");
    }
  }

  return (
    <main className="page">
      <section className="workspace">
        <header className="header">
          <div>
            <p className="eyebrow">Локальный менеджер задач</p>
            <h1>Задачи</h1>
          </div>
          <button className="secondaryButton" type="button" onClick={() => void loadTasks()}>
            Обновить
          </button>
        </header>

        <TaskForm
          title={title}
          description={description}
          deadline={deadline}
          photos={photos}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDeadlineChange={setDeadline}
          onPhotosChange={setPhotos}
          onSubmit={handleCreate}
        />

        {error ? <p className="error">{error}</p> : null}

        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
