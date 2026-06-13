"use client";

import { type FormEvent, useEffect, useState } from "react";
import { formatTaskDate, type TaskSubmission } from "../../lib/mock/tasks";
import { createStoredTaskSubmission } from "../../lib/taskStorage";

type TaskSubmissionFormProps = {
  existingSubmission?: TaskSubmission;
  taskId: string;
};

export function TaskSubmissionForm({ existingSubmission, taskId }: TaskSubmissionFormProps) {
  const [submission, setSubmission] = useState<TaskSubmission | undefined>(existingSubmission);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSubmission(existingSubmission);
  }, [existingSubmission]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Escribe tu entrega antes de enviarla.");
      return;
    }

    const nextSubmission = createStoredTaskSubmission({ content, taskId });
    setSubmission(nextSubmission);
    setContent("");
    setError("");
  }

  if (submission) {
    return (
      <section className="mt-8 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Entrega enviada</h2>
        <p className="m-0 mt-2 text-sm font-semibold text-brand-green">Enviada el {formatTaskDate(submission.submittedAt.slice(0, 10))}</p>
        <p className="m-0 mt-4 whitespace-pre-line text-base font-medium leading-7 text-neutral-black">{submission.content}</p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-4 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Escribe tu respuesta o comentario de entrega
        <textarea
          className={[
            "min-h-40 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            error ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) {
              setError(event.target.value.trim() ? "" : error);
            }
          }}
        />
        {error ? <span className="text-sm font-semibold text-[#E5484D]">{error}</span> : null}
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Enviar entrega
        </button>
      </div>
    </form>
  );
}
