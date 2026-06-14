"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { formatTaskDate, taskPdfAttachmentMaxSizeBytes, type TaskSubmission } from "../../lib/mock/tasks";
import { formatTaskFileSize, submitTask, type StoredTaskSubmissionAttachmentInput } from "../../lib/repositories/taskRepository";

type TaskSubmissionFormProps = {
  existingSubmission?: TaskSubmission;
  taskId: string;
};

export function TaskSubmissionForm({ existingSubmission, taskId }: TaskSubmissionFormProps) {
  const [submission, setSubmission] = useState<TaskSubmission | undefined>(existingSubmission);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<StoredTaskSubmissionAttachmentInput[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setSubmission(existingSubmission);
  }, [existingSubmission]);

  function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    // TODO: Compress/pre-process PDFs before upload when real storage is added.
    setAttachments((currentAttachments) => [
      ...currentAttachments,
      ...files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream"
      }))
    ]);
    event.target.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Escribe tu entrega antes de enviarla.");
      return;
    }

    const nextSubmission = submitTask({ attachments: attachments.length ? attachments : undefined, content, taskId });
    setSubmission(nextSubmission);
    setAttachments([]);
    setContent("");
    setError("");
  }

  if (submission) {
    return (
      <section className="mt-8 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Entrega enviada</h2>
        <p className="m-0 mt-2 text-sm font-semibold text-brand-green">Enviada el {formatTaskDate(submission.submittedAt.slice(0, 10))}</p>
        <p className="m-0 mt-4 whitespace-pre-line text-base font-medium leading-7 text-neutral-black">{submission.content}</p>
        {submission.attachments?.length ? (
          <div className="mt-5 grid gap-2">
            <h3 className="m-0 text-sm font-extrabold text-neutral-black">Adjuntos enviados</h3>
            {submission.attachments.map((attachment) => (
              <div className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={attachment.id}>
                <p className="m-0 text-sm font-bold text-neutral-black">{attachment.name}</p>
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

      <div className="grid gap-3 rounded-2xl bg-neutral-offWhite p-4">
        <div>
          <h3 className="m-0 text-sm font-extrabold text-neutral-black">Adjuntos de entrega</h3>
          <p className="m-0 mt-1 text-xs font-medium leading-5 text-neutral-darkGray">
            Los archivos se guardan como metadatos temporales. PDF recomendado: máximo {formatTaskFileSize(taskPdfAttachmentMaxSizeBytes)}.
          </p>
        </div>
        <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-dashed border-neutral-lightGray bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green">
          Adjuntar archivo
          <input
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*,application/pdf"
            className="sr-only"
            multiple
            onChange={handleAttachmentChange}
            type="file"
          />
        </label>
        {attachments.length ? (
          <div className="grid gap-2">
            {attachments.map((attachment, index) => {
              const isPdf = attachment.type === "application/pdf" || attachment.name.toLowerCase().endsWith(".pdf");
              const withinAllowedSize = !isPdf || attachment.size <= taskPdfAttachmentMaxSizeBytes;

              return (
                <div className="flex flex-col gap-2 rounded-2xl bg-neutral-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between" key={`${attachment.name}-${index}`}>
                  <div>
                    <p className="m-0 text-sm font-bold text-neutral-black">{attachment.name}</p>
                    <p className="m-0 mt-1 text-xs font-medium text-neutral-darkGray">
                      {attachment.type || "Archivo"} · {formatTaskFileSize(attachment.size)}
                      {isPdf ? ` · ${withinAllowedSize ? "PDF apto" : "PDF supera el límite sugerido"}` : null}
                    </p>
                  </div>
                  <button
                    className="w-fit text-sm font-bold text-brand-green transition-colors duration-base hover:text-neutral-black"
                    onClick={() => setAttachments((currentAttachments) => currentAttachments.filter((_, attachmentIndex) => attachmentIndex !== index))}
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

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
