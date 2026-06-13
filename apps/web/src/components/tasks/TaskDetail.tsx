import type { ReactNode } from "react";
import { formatTaskDate, taskStatusLabels, type Task } from "../../lib/mock/tasks";

type TaskDetailProps = {
  courseName: string;
  relatedNoteTitle?: string;
  task: Task;
  teacherActions?: ReactNode;
};

function getStatusClassName(status: Task["status"]) {
  if (status === "published") {
    return "border-brand-green bg-brand-greenLight text-neutral-black";
  }

  return "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";
}

export function TaskDetail({ courseName, relatedNoteTitle, task, teacherActions }: TaskDetailProps) {
  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-neutral-lightGray pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="m-0 text-sm font-semibold text-brand-green">{courseName}</p>
          <h2 className="m-0 mt-2 text-3xl font-extrabold leading-tight text-neutral-black">{task.title}</h2>
          <p className="m-0 mt-3 max-w-3xl text-base font-medium leading-7 text-neutral-darkGray">{task.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClassName(task.status)}`}>
            {taskStatusLabels[task.status]}
          </span>
          {teacherActions}
        </div>
      </div>

      <div className="grid gap-5 pt-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-neutral-offWhite px-4 py-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Entrega</p>
            <p className="m-0 mt-1 text-base font-bold text-neutral-black">{formatTaskDate(task.dueDate)}</p>
          </div>
          <div className="rounded-2xl bg-neutral-offWhite px-4 py-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Puntaje</p>
            <p className="m-0 mt-1 text-base font-bold text-neutral-black">{task.points} puntos</p>
          </div>
          <div className="rounded-2xl bg-neutral-offWhite px-4 py-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Nota relacionada</p>
            <p className="m-0 mt-1 text-base font-bold text-neutral-black">{relatedNoteTitle ?? "Sin nota relacionada"}</p>
          </div>
        </div>

        <div>
          <h3 className="m-0 text-xl font-extrabold text-neutral-black">Instrucciones</h3>
          <div className="mt-3 max-w-4xl whitespace-pre-line text-base font-medium leading-8 text-neutral-black">{task.instructions}</div>
        </div>
      </div>
    </article>
  );
}
