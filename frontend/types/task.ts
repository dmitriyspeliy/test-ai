export type TaskStatus = "TODO" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
};

export type TaskAttachment = {
  id: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  url: string;
};

export type CreateTaskRequest = {
  title: string;
  description: string | null;
  deadline: string | null;
};
