import { Task, TaskStatus } from "../types/task";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
};

export function TaskList({ tasks, isLoading, onStatusChange, onDelete }: TaskListProps) {
  if (isLoading) {
    return <p className="empty">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return <p className="empty">No tasks yet.</p>;
  }

  return (
    <div className="taskList">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
