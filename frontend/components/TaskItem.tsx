import { Task, TaskStatus } from "../types/task";

type TaskItemProps = {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
};

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  return (
    <article className="taskItem">
      <div>
        <p className="taskTitle">{task.title}</p>
        {task.description ? <p className="taskDescription">{task.description}</p> : null}
      </div>
      <select
        className="select"
        aria-label={`Status for ${task.title}`}
        value={task.status}
        onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
      >
        <option value="TODO">Todo</option>
        <option value="DONE">Done</option>
      </select>
      <button className="dangerButton" type="button" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </article>
  );
}
