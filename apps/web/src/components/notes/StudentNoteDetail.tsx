"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { NoteDetail } from "./NoteDetail";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNoteById, getNoteByIdAsync, type Note } from "../../lib/repositories/noteRepository";

type StudentNoteDetailProps = {
  courseId: string;
  noteId: string;
};

export function StudentNoteDetail({ courseId, noteId }: StudentNoteDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "student")));
  const [note, setNote] = useState<Note | undefined>(() =>
    isFirebaseDataSource() ? undefined : getInitialNoteById(courseId, noteId, { publishedOnly: true })
  );
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(!isFirebaseDataSource());

  useEffect(() => {
    let isActive = true;

    void Promise.all([getCourseByIdAsync(courseId, "student"), getNoteByIdAsync(courseId, noteId, { publishedOnly: true })])
      .then(([nextCourse, nextNote]) => {
        if (isActive) {
          setCourse(nextCourse);
          setNote(nextNote);
        }
      })
      .catch(() => {
        if (isActive) {
          setCourse(undefined);
          setNote(undefined);
        }
      })
      .finally(() => {
        if (isActive) {
          setHasLoadedStoredData(true);
        }
      });

    return () => {
      isActive = false;
    };
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
      title="Nota de clase"
      subtitle={course.name}
      primaryAction={
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <NoteDetail note={note} />
    </AppShell>
  );
}
