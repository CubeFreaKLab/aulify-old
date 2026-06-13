"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import type { TaskStatus } from "../../lib/mock/tasks";
import { getInitialNotesByCourseId, getNotesByCourseId, type Note } from "../../lib/repositories/noteRepository";
import { createTask } from "../../lib/repositories/taskRepository";

type TaskFormProps = {
  courseId: string;
};

type TaskFormErrors = {
  description: string;
  dueDate: string;
  instructions: string;
  title: string;
};

const statusOptions: Array<{ label: string; value: Exclude<TaskStatus, "closed"> }> = [
  { label: "Borrador", value: "draft" },
  { label: "Publicada", value: "published" }
];

export function TaskForm({ courseId }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("100");
  const [status, setStatus] = useState<Exclude<TaskStatus, "closed">>("draft");
  const [relatedNoteId, setRelatedNoteId] = useState("");
  const [courseNotes, setCourseNotes] = useState<Note[]>(() => getInitialNotesByCourseId(courseId));
  const [errors, setErrors] = useState<TaskFormErrors>({ description: "", dueDate: "", instructions: "", title: "" });

  useEffect(() => {
    setCourseNotes(getNotesByCourseId(courseId));
  }, [courseId]);

  function validateForm() {
    return {
      title: title.trim() ? "" : "Ingresa el título de la tarea.",
      description: description.trim() ? "" : "Ingresa una descripción breve.",
      instructions: instructions.trim() ? "" : "Ingresa las instrucciones de la tarea.",
      dueDate: dueDate.trim() ? "" : "Selecciona una fecha de entrega."
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.description || nextErrors.instructions || nextErrors.dueDate) {
      return;
    }

    const task = createTask({
      courseId,
      description,
      dueDate,
      instructions,
      points: Math.max(0, Number(points) || 0),
      relatedNoteId: relatedNoteId || undefined,
      status,
      title
    });

    router.push(`/teacher/courses/${courseId}/tasks/${task.id}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Título de la tarea *
        <input
          className={[
            "h-14 rounded-2xl border bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.title ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              setErrors((currentErrors) => ({ ...currentErrors, title: event.target.value.trim() ? "" : currentErrors.title }));
            }
          }}
        />
        {errors.title ? <span className="text-sm font-semibold text-[#E5484D]">{errors.title}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Descripción breve *
        <textarea
          className={[
            "min-h-24 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.description ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (errors.description) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                description: event.target.value.trim() ? "" : currentErrors.description
              }));
            }
          }}
        />
        {errors.description ? <span className="text-sm font-semibold text-[#E5484D]">{errors.description}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Instrucciones *
        <textarea
          className={[
            "min-h-40 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.instructions ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={instructions}
          onChange={(event) => {
            setInstructions(event.target.value);
            if (errors.instructions) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                instructions: event.target.value.trim() ? "" : currentErrors.instructions
              }));
            }
          }}
        />
        {errors.instructions ? <span className="text-sm font-semibold text-[#E5484D]">{errors.instructions}</span> : null}
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-neutral-black">
          Fecha de entrega *
          <input
            className={[
              "h-14 rounded-2xl border bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
              errors.dueDate ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
            ].join(" ")}
            type="date"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value);
              if (errors.dueDate) {
                setErrors((currentErrors) => ({ ...currentErrors, dueDate: event.target.value.trim() ? "" : currentErrors.dueDate }));
              }
            }}
          />
          {errors.dueDate ? <span className="text-sm font-semibold text-[#E5484D]">{errors.dueDate}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-bold text-neutral-black">
          Puntaje
          <input
            className="h-14 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
            min="0"
            type="number"
            value={points}
            onChange={(event) => setPoints(event.target.value)}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Relacionar con una nota
        <select
          className="h-14 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
          value={relatedNoteId}
          onChange={(event) => setRelatedNoteId(event.target.value)}
        >
          <option value="">Sin nota relacionada</option>
          {courseNotes.map((note) => (
            <option key={note.id} value={note.id}>
              {note.title}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-2">
        <p className="m-0 text-sm font-bold text-neutral-black">Estado</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const isSelected = option.value === status;

            return (
              <button
                type="button"
                className={[
                  "min-h-11 rounded-full border px-5 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                  isSelected
                    ? "border-brand-green bg-brand-green text-neutral-white"
                    : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                ].join(" ")}
                key={option.value}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Guardar tarea
        </button>
      </div>
    </form>
  );
}
