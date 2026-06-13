"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { NoteForm } from "./NoteForm";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNoteById, getNoteById, type Note } from "../../lib/repositories/noteRepository";

type TeacherNoteEditorProps = {
  courseId: string;
  noteId: string;
};

export function TeacherNoteEditor({ courseId, noteId }: TeacherNoteEditorProps) {
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "teacher"));
  const [note, setNote] = useState<Note | undefined>(() => getInitialNoteById(courseId, noteId));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    setCourse(getCourseById(courseId, "teacher"));
    setNote(getNoteById(courseId, noteId));
    setHasLoadedStoredData(true);
  }, [courseId, noteId]);

  if ((!course || !note) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/notes"
        role="teacher"
        title="Cargando nota"
        subtitle="Estamos preparando el editor."
        primaryAction={
          <Link
            href={`/teacher/courses/${courseId}/notes/${noteId}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black"
          >
            Volver a la nota
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Cargando información...
        </div>
      </AppShell>
    );
  }

  if (!course || !note) {
    return (
      <AppShell
        activeHref="/teacher/notes"
        role="teacher"
        title="Nota no encontrada"
        subtitle="No pudimos encontrar el contenido solicitado."
        primaryAction={
          <Link
            href={`/teacher/courses/${courseId}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver al curso
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa las notas del curso para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/teacher/notes"
      role="teacher"
      title="Editar nota"
      subtitle={`${course.name} · ${note.title}`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}/notes/${note.id}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
      }
    >
      <div className="max-w-4xl">
        <NoteForm courseId={courseId} note={note} />
      </div>
    </AppShell>
  );
}
