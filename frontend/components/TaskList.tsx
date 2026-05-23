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
    return <p className="empty">Загружаем задачи...</p>;
  }

  if (tasks.length === 0) {
    return <p className="empty">Задач пока нет.</p>;
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
