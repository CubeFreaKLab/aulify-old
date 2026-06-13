"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { NoteDetail } from "./NoteDetail";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNoteById, getNoteById, type Note } from "../../lib/repositories/noteRepository";

type StudentNoteDetailProps = {
  courseId: string;
  noteId: string;
};

export function StudentNoteDetail({ courseId, noteId }: StudentNoteDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "student"));
  const [note, setNote] = useState<Note | undefined>(() => getInitialNoteById(courseId, noteId, { publishedOnly: true }));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    setCourse(getCourseById(courseId, "student"));
    setNote(getNoteById(courseId, noteId, { publishedOnly: true }));
    setHasLoadedStoredData(true);
  }, [courseId, noteId]);

  if ((!course || !note) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/student/notes"
        role="student"
        title="Cargando nota"
        subtitle="Estamos preparando el contenido."
        primaryAction={
          <Link
            href={`/student/courses/${courseId}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black"
          >
            Volver al curso
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
        activeHref="/student/notes"
        role="student"
        title="Nota no encontrada"
        subtitle="No pudimos encontrar una nota publicada para este curso."
        primaryAction={
          <Link
            href="/student/notes"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver a notas
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa las notas publicadas en tus cursos para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/student/notes"
      role="student"
      title={note.title}
      subtitle={`${course.name} · ${note.summary}`}
      primaryAction={
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <NoteDetail courseName={course.name} note={note} />
    </AppShell>
  );
}
