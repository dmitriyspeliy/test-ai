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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setError(null);
    try {
      setTasks(await fetchTasks());
    } catch {
      setError("Could not load tasks.");
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
        description: description.trim() || null
      });
      setTasks((current) => [task, ...current]);
      setTitle("");
      setDescription("");
    } catch {
      setError("Could not create task.");
    }
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    setError(null);
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
    } catch {
      setError("Could not update task.");
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch {
      setError("Could not delete task.");
    }
  }

  return (
    <main className="page">
      <section className="workspace">
        <header className="header">
          <div>
            <p className="eyebrow">Local task manager</p>
            <h1>Tasks</h1>
          </div>
          <button className="secondaryButton" type="button" onClick={() => void loadTasks()}>
            Refresh
          </button>
        </header>

        <TaskForm
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
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
