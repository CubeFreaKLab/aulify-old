"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { DashboardCard } from "../app/DashboardCard";
import { CoursePreviewList } from "./CoursePreviewList";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { findCourseById, studentCourses, type Course } from "../../lib/mock/courses";
import { getCourseNotes, getPublishedNotes, mockNotes, type Note } from "../../lib/mock/notes";
import { readStoredTeacherNotes } from "../../lib/noteStorage";

type StudentCourseDetailProps = {
  courseId: string;
};

function createNotePreviewItems(courseId: string, notes: Note[]) {
  return notes.map((note) => ({
    title: note.title,
    detail: note.summary,
    href: `/student/courses/${courseId}/notes/${note.id}`
  }));
}

export function StudentCourseDetail({ courseId }: StudentCourseDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => findCourseById(courseId, studentCourses));
  const [notes, setNotes] = useState<Note[]>(() => getCourseNotes(courseId, getPublishedNotes(mockNotes)));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const courses = [...readStoredTeacherCourses(), ...studentCourses];
    const publishedNotes = getPublishedNotes([...readStoredTeacherNotes(), ...mockNotes]);

    setCourse(findCourseById(courseId, courses));
    setNotes(getCourseNotes(courseId, publishedNotes));
    setHasLoadedStoredData(true);
  }, [courseId]);

  if (!course && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/student/courses"
        role="student"
        title="Cargando curso"
        subtitle="Estamos preparando la información del curso."
        primaryAction={
          <Link
            href="/student/courses"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black"
          >
            Volver a cursos
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Cargando información...
        </div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell
        activeHref="/student/courses"
        role="student"
        title="Curso no encontrado"
        subtitle="No pudimos encontrar el curso solicitado."
        primaryAction={
          <Link
            href="/student/courses"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver a cursos
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa tus cursos inscritos para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/student/courses"
      role="student"
      title={course.name}
      subtitle={`${course.teacherName} · ${course.description}`}
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver a cursos
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Progreso" value={course.progress.label} helper="Avance del curso" />
        <DashboardCard label="Tareas pendientes" value={String(course.pendingTasksCount)} helper="Por completar" />
        <DashboardCard label="Actividades" value={String(course.pendingActivitiesCount)} helper="Asignadas" />
        <DashboardCard label="Contenidos" value={String(Math.max(course.contentsCount, notes.length))} helper="Disponibles" />
      </section>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <CoursePreviewList emptyLabel="Aún no hay contenidos recientes." items={createNotePreviewItems(courseId, notes)} title="Contenidos recientes" />
        <CoursePreviewList emptyLabel="No tienes tareas pendientes." items={course.tasks} title="Tareas pendientes" />
        <CoursePreviewList emptyLabel="No tienes actividades por completar." items={course.activities} title="Actividades por completar" />
      </div>
    </AppShell>
  );
}
