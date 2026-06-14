"use client";

import type { PartialBlock } from "@blocknote/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from "react";
import { AulifyDocumentEditor } from "../notes/AulifyDocumentEditor";
import { getInitialNotesByCourseId, getNotesByCourseId, type Note } from "../../lib/repositories/noteRepository";
import {
  createTask,
  createTaskExcerptFromBlocks,
  formatTaskFileSize,
  getRenderableTaskInstructionBlocks,
  hasMeaningfulTaskInstructionBlocks,
  serializeTaskInstructionBlocks,
  updateTask,
  type Task,
  type TaskAttachment,
  type TaskResource,
  type TaskStatus
} from "../../lib/repositories/taskRepository";

type TaskFormProps = {
  courseId: string;
  task?: Task;
};

type TaskFormErrors = {
  dueDate?: string;
  instructions?: string;
  title?: string;
};

const emptyDocument: PartialBlock[] = [{ content: "", type: "paragraph" }];

function createDraftId(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || fallback}-${Date.now()}`;
}

function getInitialStatus(task?: Task): Exclude<TaskStatus, "closed"> {
  return task?.status === "draft" ? "draft" : "published";
}

export function TaskForm({ courseId, task }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [points, setPoints] = useState(String(task?.points ?? 100));
  const [status, setStatus] = useState<Exclude<TaskStatus, "closed">>(() => getInitialStatus(task));
  const [relatedNoteId, setRelatedNoteId] = useState(task?.relatedNoteId ?? "");
  const [instructionBlocks, setInstructionBlocks] = useState<PartialBlock[]>(() =>
    task ? getRenderableTaskInstructionBlocks(task) : emptyDocument
  );
  const [resources, setResources] = useState<TaskResource[]>(task?.resources ?? []);
  const [attachments, setAttachments] = useState<TaskAttachment[]>(task?.attachments ?? []);
  const [resourceLabel, setResourceLabel] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => getInitialNotesByCourseId(courseId));
  const [errors, setErrors] = useState<TaskFormErrors>({});

  useEffect(() => {
    setNotes(getNotesByCourseId(courseId));
  }, [courseId]);

  const handleDocumentChange = useCallback((blocks: PartialBlock[]) => {
    setInstructionBlocks(blocks);
    setErrors((currentErrors) =>
      currentErrors.instructions && hasMeaningfulTaskInstructionBlocks(blocks)
        ? { ...currentErrors, instructions: undefined }
        : currentErrors
    );
  }, []);

  function validate() {
    const nextErrors: TaskFormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Ingresa el título de la tarea.";
    }

    if (!hasMeaningfulTaskInstructionBlocks(instructionBlocks)) {
      nextErrors.instructions = "Ingresa las instrucciones de la tarea.";
    }

    if (!dueDate) {
      nextErrors.dueDate = "Selecciona una fecha de entrega.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleAddResource() {
    if (!resourceLabel.trim() || !resourceUrl.trim()) {
      return;
    }

    setResources((currentResources) => [
      ...currentResources,
      {
        id: createDraftId(resourceLabel, "recurso"),
        label: resourceLabel.trim(),
        url: resourceUrl.trim()
      }
    ]);
    setResourceLabel("");
    setResourceUrl("");
  }

  function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const nextAttachments: TaskAttachment[] = files.map((file) => ({
      createdAt: new Date().toISOString(),
      id: createDraftId(file.name, "adjunto"),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream"
    }));

    setAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments]);
    event.target.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const instructions = serializeTaskInstructionBlocks(instructionBlocks);
    const summary = createTaskExcerptFromBlocks(instructionBlocks, task?.description ?? instructions);
    const payload = {
      attachments: attachments.length ? attachments : undefined,
      courseId,
      description: summary,
      dueDate,
      instructions,
      instructionsBlocks: instructionBlocks,
      points: Math.max(0, Number(points) || 0),
      relatedNoteId: relatedNoteId || undefined,
      resources: resources.length ? resources : undefined,
      status,
      summary,
      title
    };
    const savedTask = task ? updateTask({ ...payload, createdAt: task.createdAt, id: task.id }) : createTask(payload);

    router.push(`/teacher/courses/${courseId}/tasks/${savedTask.id}`);
  }

  return (
    <form className="grid gap-6" noValidate onSubmit={handleSubmit}>
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-8">
        <div className="flex flex-col gap-5 border-b border-neutral-lightGray pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm font-bold uppercase tracking-wide text-brand-green">Documento de práctica</p>
            <label className="mt-3 block">
              <span className="sr-only">Título de la tarea</span>
              <input
                className={[
                  "w-full border-0 bg-transparent px-0 text-4xl font-extrabold leading-tight text-neutral-black outline-none placeholder:text-neutral-darkGray/50 focus:ring-0 sm:text-5xl",
                  errors.title ? "text-[#E5484D]" : ""
                ].join(" ")}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (errors.title && event.target.value.trim()) {
                    setErrors((currentErrors) => ({ ...currentErrors, title: undefined }));
                  }
                }}
                placeholder="Título de la tarea"
                value={title}
              />
            </label>
            {errors.title ? <p className="m-0 mt-2 text-sm font-semibold text-[#E5484D]">{errors.title}</p> : null}
          </div>

          <div className="inline-flex w-fit rounded-full border border-neutral-lightGray bg-neutral-white p-1">
            {[
              { label: "Borrador", value: "draft" },
              { label: "Publicada", value: "published" }
            ].map((option) => (
              <button
                aria-pressed={status === option.value}
                className={[
                  "min-h-10 rounded-full px-4 text-sm font-bold transition-colors duration-base",
                  status === option.value
                    ? "bg-brand-green text-neutral-white"
                    : "bg-neutral-white text-neutral-black hover:bg-neutral-offWhite"
                ].join(" ")}
                key={option.value}
                onClick={() => setStatus(option.value as Exclude<TaskStatus, "closed">)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_160px_1fr]">
          <label className="grid gap-2 text-sm font-bold text-neutral-black">
            Fecha de entrega *
            <input
              className={[
                "min-h-12 rounded-full border bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
                errors.dueDate ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
              ].join(" ")}
              onChange={(event) => {
                setDueDate(event.target.value);
                if (errors.dueDate && event.target.value) {
                  setErrors((currentErrors) => ({ ...currentErrors, dueDate: undefined }));
                }
              }}
              type="date"
              value={dueDate}
            />
            {errors.dueDate ? <span className="text-sm font-semibold text-[#E5484D]">{errors.dueDate}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-bold text-neutral-black">
            Puntaje
            <input
              className="min-h-12 rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
              min="0"
              onChange={(event) => setPoints(event.target.value)}
              type="number"
              value={points}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-neutral-black">
            Relacionar con una nota
            <select
              className="min-h-12 rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
              onChange={(event) => setRelatedNoteId(event.target.value)}
              value={relatedNoteId}
            >
              <option value="">Sin nota relacionada</option>
              {notes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex flex-col gap-1">
            <h2 className="m-0 text-lg font-extrabold text-neutral-black">Instrucciones</h2>
            <p className="m-0 text-sm font-medium text-neutral-darkGray">
              Escribe la práctica con estructura, recursos y criterios claros.
            </p>
          </div>
          <AulifyDocumentEditor initialBlocks={instructionBlocks} onChange={handleDocumentChange} />
          {errors.instructions ? <p className="m-0 mt-2 text-sm font-semibold text-[#E5484D]">{errors.instructions}</p> : null}
        </div>
      </section>

      <section className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
        <div>
          <h2 className="m-0 text-xl font-extrabold text-neutral-black">Recursos y enlaces</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">
            Agrega materiales de apoyo que acompañen la práctica.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <input
            className="min-h-12 rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base placeholder:text-neutral-darkGray/70 focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
            onChange={(event) => setResourceLabel(event.target.value)}
            placeholder="Nombre del recurso"
            value={resourceLabel}
          />
          <input
            className="min-h-12 rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base placeholder:text-neutral-darkGray/70 focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
            onChange={(event) => setResourceUrl(event.target.value)}
            placeholder="https://..."
            type="url"
            value={resourceUrl}
          />
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            onClick={handleAddResource}
            type="button"
          >
            Agregar recurso
          </button>
        </div>

        {resources.length ? (
          <div className="grid gap-2">
            {resources.map((resource) => (
              <div className="flex flex-col gap-2 rounded-2xl bg-neutral-offWhite px-4 py-3 sm:flex-row sm:items-center sm:justify-between" key={resource.id}>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold text-neutral-black">{resource.label}</p>
                  <p className="m-0 mt-1 truncate text-xs font-medium text-neutral-darkGray">{resource.url}</p>
                </div>
                <button
                  className="w-fit text-sm font-bold text-brand-green transition-colors duration-base hover:text-neutral-black"
                  onClick={() => setResources((currentResources) => currentResources.filter((item) => item.id !== resource.id))}
                  type="button"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
        <div>
          <h2 className="m-0 text-xl font-extrabold text-neutral-black">Adjuntos de referencia</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">
            Se guarda solo la información del archivo para esta versión local.
          </p>
        </div>

        <label className="flex min-h-14 cursor-pointer items-center justify-center rounded-full border border-dashed border-neutral-lightGray bg-neutral-offWhite px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green">
          Agregar adjuntos de práctica
          <input className="sr-only" multiple onChange={handleAttachmentChange} type="file" />
        </label>

        {attachments.length ? (
          <div className="grid gap-2">
            {attachments.map((attachment) => (
              <div className="flex flex-col gap-2 rounded-2xl bg-neutral-offWhite px-4 py-3 sm:flex-row sm:items-center sm:justify-between" key={attachment.id}>
                <div>
                  <p className="m-0 text-sm font-bold text-neutral-black">{attachment.name}</p>
                  <p className="m-0 mt-1 text-xs font-medium text-neutral-darkGray">
                    {attachment.type || "Archivo"} · {formatTaskFileSize(attachment.size)}
                  </p>
                </div>
                <button
                  className="w-fit text-sm font-bold text-brand-green transition-colors duration-base hover:text-neutral-black"
                  onClick={() => setAttachments((currentAttachments) => currentAttachments.filter((item) => item.id !== attachment.id))}
                  type="button"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-3xl border border-neutral-lightGray bg-neutral-white/95 p-3 shadow-soft backdrop-blur sm:flex-row sm:justify-end">
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          href={task ? `/teacher/courses/${courseId}/tasks/${task.id}` : `/teacher/courses/${courseId}`}
        >
          Cancelar
        </Link>
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          type="submit"
        >
          Guardar tarea
        </button>
      </div>
    </form>
  );
}
