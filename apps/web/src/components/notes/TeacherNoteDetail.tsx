"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { NoteDetail } from "./NoteDetail";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { findCourseById, teacherCourses, type Course } from "../../lib/mock/courses";
import { findNoteById, mockNotes, type Note } from "../../lib/mock/notes";
import { readStoredTeacherNotes } from "../../lib/noteStorage";

type TeacherNoteDetailProps = {
  courseId: string;
  noteId: string;
};

export function TeacherNoteDetail({ courseId, noteId }: TeacherNoteDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => findCourseById(courseId));
  const [note, setNote] = useState<Note | undefined>(() => findNoteById(courseId, noteId));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const courses = [...readStoredTeacherCourses(), ...teacherCourses];
    const notes = [...readStoredTeacherNotes(), ...mockNotes];

    setCourse(findCourseById(courseId, courses));
    setNote(findNoteById(courseId, noteId, notes));
    setHasLoadedStoredData(true);
  }, [courseId, noteId]);

  if ((!course || !note) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/notes"
        role="teacher"
        title="Cargando nota"
        subtitle="Estamos preparando el contenido."
        primaryAction={
          <Link
            href={`/teacher/courses/${courseId}`}
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
      title={note.title}
      subtitle={`${course.name} · ${note.summary}`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <NoteDetail
        courseName={course.name}
        note={note}
        teacherActions={
          <>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              Editar
            </button>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-green px-4 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              {note.status === "published" ? "Marcar como borrador" : "Publicar"}
            </button>
          </>
        }
      />
    </AppShell>
  );
}
