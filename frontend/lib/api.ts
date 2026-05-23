import { CreateTaskRequest, Task, TaskStatus } from "../types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchTasks(): Promise<Task[]> {
  return request<Task[]>("/api/tasks");
}

export function createTask(payload: CreateTaskRequest): Promise<Task> {
  return request<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function uploadTaskAttachments(taskId: number, files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/attachments`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Attachment upload failed with status ${response.status}`);
  }
}

export function getAttachmentUrl(url: string): string {
  return `${API_BASE_URL}${url}`;
}

export function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  return request<Task>(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
