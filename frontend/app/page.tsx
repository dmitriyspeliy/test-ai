"use client";

import { FormEvent, useEffect, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTaskStatus } from "../lib/api";
import { Task, TaskStatus } from "../types/task";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    setError(null);
    try {
      const task = await createTask({
        title: trimmedTitle,
        description: description.trim() || null,
        deadline: deadline || null
      });
      setTasks((current) => [task, ...current]);
      setTitle("");
      setDescription("");
      setDeadline("");
    } catch {
      setError("Не удалось добавить задачу.");
    }
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
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDeadlineChange={setDeadline}
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
