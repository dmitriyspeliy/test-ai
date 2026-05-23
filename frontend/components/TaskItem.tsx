import { Task, TaskStatus } from "../types/task";

type TaskItemProps = {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
};

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const isDone = task.status === "DONE";
  const isOverdue = task.deadline ? task.deadline < new Date().toISOString().slice(0, 10) && !isDone : false;
  const formattedDeadline = task.deadline
    ? new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(
        new Date(`${task.deadline}T00:00:00`)
      )
    : "Без срока";

  return (
    <article className={`taskItem${isOverdue ? " taskItemOverdue" : ""}`}>
      <div>
        <p className="taskTitle">{task.title}</p>
        {task.description ? <p className="taskDescription">{task.description}</p> : null}
        <p className={`taskDeadline${isOverdue ? " taskDeadlineOverdue" : ""}`}>
          {isOverdue ? "Просрочено: " : "Срок: "}
          {formattedDeadline}
        </p>
      </div>
      <select
        className="select"
        aria-label={`Статус задачи ${task.title}`}
        value={task.status}
        onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
      >
        <option value="TODO">К выполнению</option>
        <option value="DONE">Выполнено</option>
      </select>
      <button className="dangerButton" type="button" onClick={() => onDelete(task.id)}>
        Удалить
      </button>
    </article>
  );
}
