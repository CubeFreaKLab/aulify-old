"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { NoteDetail } from "./NoteDetail";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { findCourseById, studentCourses, type Course } from "../../lib/mock/courses";
import { findNoteById, getPublishedNotes, mockNotes, type Note } from "../../lib/mock/notes";
import { readStoredTeacherNotes } from "../../lib/noteStorage";

type StudentNoteDetailProps = {
  courseId: string;
  noteId: string;
};

export function StudentNoteDetail({ courseId, noteId }: StudentNoteDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => findCourseById(courseId, studentCourses));
  const [note, setNote] = useState<Note | undefined>(() => findNoteById(courseId, noteId, getPublishedNotes(mockNotes)));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const courses = [...readStoredTeacherCourses(), ...studentCourses];
    const notes = getPublishedNotes([...readStoredTeacherNotes(), ...mockNotes]);

    setCourse(findCourseById(courseId, courses));
    setNote(findNoteById(courseId, noteId, notes));
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
