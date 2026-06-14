import { formatTaskDate, submissionStatusLabels, type TaskSubmission } from "../../lib/mock/tasks";
import { formatTaskFileSize } from "../../lib/repositories/taskRepository";

type TaskSubmissionsListProps = {
  submissions: TaskSubmission[];
};

export function TaskSubmissionsList({ submissions }: TaskSubmissionsListProps) {
  return (
    <section className="mt-8 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Entregas</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">Revisa avances enviados por estudiantes.</p>
        </div>
        <p className="m-0 text-sm font-bold text-brand-green">{submissions.length} entregas</p>
      </div>

      <div className="mt-5 grid gap-3">
        {submissions.length ? (
          submissions.map((submission) => (
            <article className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={submission.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="m-0 text-base font-bold text-neutral-black">{submission.studentName}</h3>
                  <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">
                    Enviado {formatTaskDate(submission.submittedAt.slice(0, 10))}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-neutral-lightGray bg-neutral-white px-3 py-1 text-xs font-bold text-neutral-darkGray">
                  {submissionStatusLabels[submission.status]}
                </span>
              </div>
              <p className="m-0 mt-3 text-sm font-medium leading-6 text-neutral-black">{submission.content}</p>
              {submission.attachments?.length ? (
                <div className="mt-3 grid gap-2">
                  {submission.attachments.map((attachment) => (
                    <div className="rounded-xl bg-neutral-white px-3 py-2" key={attachment.id}>
                      <p className="m-0 text-xs font-bold text-neutral-black">{attachment.name}</p>
                      <p className="m-0 mt-1 text-xs font-medium text-neutral-darkGray">
                        {attachment.type || "Archivo"} · {formatTaskFileSize(attachment.size)}
                        {attachment.isPdf
                          ? ` · ${attachment.withinAllowedSize ? "PDF dentro del límite" : "PDF supera el límite sugerido"}`
                          : null}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {submission.score ? <p className="m-0 mt-2 text-sm font-bold text-brand-green">Puntaje: {submission.score}</p> : null}
              {submission.feedback ? <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">{submission.feedback}</p> : null}
            </article>
          ))
        ) : (
          <p className="m-0 rounded-2xl bg-neutral-offWhite px-4 py-3 text-sm font-medium text-neutral-darkGray">
            Aún no hay entregas para esta tarea.
          </p>
        )}
      </div>
    </section>
  );
}
