"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoursePreviewList } from "./CoursePreviewList";
import { AppShell } from "../app/AppShell";
import { DashboardCard } from "../app/DashboardCard";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { findCourseById, teacherCourses, type Course } from "../../lib/mock/courses";

type TeacherCourseDetailProps = {
  courseId: string;
};

export function TeacherCourseDetail({ courseId }: TeacherCourseDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => findCourseById(courseId));
  const [hasLoadedStoredCourses, setHasLoadedStoredCourses] = useState(false);

  useEffect(() => {
    setCourse(findCourseById(courseId, [...readStoredTeacherCourses(), ...teacherCourses]));
    setHasLoadedStoredCourses(true);
  }, [courseId]);

  if (!course && !hasLoadedStoredCourses) {
    return (
      <AppShell
        activeHref="/teacher/courses"
        role="teacher"
        title="Cargando curso"
        subtitle="Estamos preparando la información del curso."
        primaryAction={
          <Link
            href="/teacher/courses"
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
        activeHref="/teacher/courses"
        role="teacher"
        title="Curso no encontrado"
        subtitle="No pudimos encontrar el curso solicitado."
        primaryAction={
          <Link
            href="/teacher/courses"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver a cursos
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa la lista de cursos o crea uno nuevo.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/teacher/courses"
      role="teacher"
      title={course.name}
      subtitle={course.description}
      primaryAction={
        <Link
          href="/teacher/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver a cursos
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Estudiantes" value={String(course.studentsCount)} helper={course.groupLabel} />
        <DashboardCard label="Contenidos" value={String(course.contentsCount)} helper="Materiales publicados" />
        <DashboardCard label="Tareas" value={String(course.tasksCount)} helper="Asignaciones activas" />
        <DashboardCard label="Actividades" value={String(course.activitiesCount)} helper={course.updatedAtLabel} />
      </section>

      <section className="mt-8 flex flex-wrap gap-3">
        {["Agregar contenido", "Crear tarea", "Crear actividad"].map((label) => (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            key={label}
          >
            {label}
          </button>
        ))}
      </section>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <CoursePreviewList emptyLabel="Aún no hay contenidos en este curso." items={course.contents} title="Contenidos" />
        <CoursePreviewList emptyLabel="Aún no hay tareas en este curso." items={course.tasks} title="Tareas" />
        <CoursePreviewList emptyLabel="Aún no hay actividades en este curso." items={course.activities} title="Actividades" />
      </div>
    </AppShell>
  );
}
