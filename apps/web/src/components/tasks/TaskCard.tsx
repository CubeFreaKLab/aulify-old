import Link from "next/link";
import {
  formatTaskDate,
  studentTaskStateLabels,
  taskStatusLabels,
  type StudentTaskState,
  type Task
} from "../../lib/mock/tasks";
import { getTaskSummary } from "../../lib/repositories/taskRepository";

type TaskCardProps = {
  actionLabel: string;
  courseName: string;
  href: string;
  studentState?: StudentTaskState;
  submissionsCount?: number;
  task: Task;
  variant: "teacher" | "student";
};

function getTeacherStatusClassName(status: Task["status"]) {
  if (status === "published") {
    return "border-brand-green bg-brand-greenLight text-neutral-black";
  }

  return "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";
}

function getStudentStateClassName(state: StudentTaskState) {
  if (state === "submitted") {
    return "border-brand-green bg-brand-greenLight text-neutral-black";
  }

  return "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";
}

export function TaskCard({ actionLabel, courseName, href, studentState, submissionsCount = 0, task, variant }: TaskCardProps) {
  const badge =
    variant === "teacher"
      ? {
          className: getTeacherStatusClassName(task.status),
          label: taskStatusLabels[task.status]
        }
      : {
          className: getStudentStateClassName(studentState ?? "pending"),
          label: studentTaskStateLabels[studentState ?? "pending"]
        };

  return (
    <article className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-sm font-semibold text-brand-green">{courseName}</p>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>{badge.label}</span>
        </div>
        <h2 className="m-0 mt-2 text-2xl font-extrabold leading-tight text-neutral-black">{task.title}</h2>
        <p className="m-0 mt-2 text-sm font-medium leading-6 text-neutral-darkGray">{getTaskSummary(task)}</p>
      </div>

      <div className="grid gap-2 text-sm font-semibold text-neutral-black">
        <span>Entrega: {formatTaskDate(task.dueDate)}</span>
        <span>
          {task.points} puntos
          {variant === "teacher" ? ` · ${submissionsCount} entregas` : null}
        </span>
      </div>

      <Link
        href={href}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
      >
        {actionLabel}
      </Link>
    </article>
  );
}
