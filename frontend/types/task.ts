export type TaskStatus = "TODO" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  title: string;
  description: string | null;
  deadline: string | null;
};
