import type { ReactNode } from "react";
import { formatTaskDate, taskStatusLabels, type Task } from "../../lib/mock/tasks";
import { formatTaskFileSize, getRenderableTaskInstructionBlocks } from "../../lib/repositories/taskRepository";
import { AulifyDocumentViewer } from "../notes/AulifyDocumentViewer";

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
  const resources = task.resources ?? [];
  const attachments = task.attachments ?? [];

  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-neutral-lightGray pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="m-0 text-sm font-semibold text-brand-green">Práctica · {courseName}</p>
          <h2 className="m-0 mt-2 text-3xl font-extrabold leading-tight text-neutral-black">{task.title}</h2>
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
          <div className="mt-3">
            <AulifyDocumentViewer blocks={getRenderableTaskInstructionBlocks(task)} />
          </div>
        </div>

        {resources.length ? (
          <div>
            <h3 className="m-0 text-xl font-extrabold text-neutral-black">Recursos</h3>
            <div className="mt-3 grid gap-2">
              {resources.map((resource) => (
                <a
                  className="rounded-2xl bg-neutral-offWhite px-4 py-3 text-sm font-bold text-brand-green transition-colors duration-base hover:text-neutral-black focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
                  href={resource.url}
                  key={resource.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  {resource.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {attachments.length ? (
          <div>
            <h3 className="m-0 text-xl font-extrabold text-neutral-black">Adjuntos de referencia</h3>
            <div className="mt-3 grid gap-2">
              {attachments.map((attachment) => (
                <div className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={attachment.id}>
                  <p className="m-0 text-sm font-bold text-neutral-black">{attachment.name}</p>
                  <p className="m-0 mt-1 text-xs font-medium text-neutral-darkGray">
                    {attachment.type || "Archivo"} · {formatTaskFileSize(attachment.size)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
