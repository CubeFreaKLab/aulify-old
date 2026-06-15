"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { DashboardCard } from "../app/DashboardCard";
import { CoursePreviewList } from "./CoursePreviewList";
import {
  activityTypeLabels,
  getStudentActivityState,
  studentActivityStateLabels,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import {
  getActivitiesByCourseIdAsync,
  getActivityAttemptsAsync,
  getInitialActivitiesByCourseId,
  getInitialActivityAttempts
} from "../../lib/repositories/activityRepository";
import type { Note } from "../../lib/mock/notes";
import {
  formatTaskDate,
  getStudentTaskState,
  studentTaskStateLabels,
  type Task,
  type TaskSubmission
} from "../../lib/mock/tasks";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getInitialNotesByCourseId, getNotesByCourseIdAsync } from "../../lib/repositories/noteRepository";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import {
  getInitialTaskSubmissions,
  getInitialTasksByCourseId,
  getTaskSubmissionsAsync,
  getTasksByCourseIdAsync
} from "../../lib/repositories/taskRepository";

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

function createTaskPreviewItems(courseId: string, tasks: Task[], submissions: TaskSubmission[]) {
  return tasks.map((task) => {
    const state = getStudentTaskState(task, submissions);

    return {
      title: task.title,
      detail: `${studentTaskStateLabels[state]} · ${formatTaskDate(task.dueDate)} · ${task.points} puntos`,
      href: `/student/courses/${courseId}/tasks/${task.id}`
    };
  });
}

function createActivityPreviewItems(courseId: string, activities: Activity[], attempts: ActivityAttempt[]) {
  return activities.map((activity) => {
    const state = getStudentActivityState(activity, attempts);

    return {
      title: activity.title,
      detail: `${activityTypeLabels[activity.type]} · ${studentActivityStateLabels[state]}`,
      href: `/student/courses/${courseId}/activities/${activity.id}`
    };
  });
}

export function StudentCourseDetail({ courseId }: StudentCourseDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "student")));
  const [notes, setNotes] = useState<Note[]>(() => getInitialNotesByCourseId(courseId, { publishedOnly: true }));
  const [tasks, setTasks] = useState<Task[]>(() => getInitialTasksByCourseId(courseId, { publishedOnly: true }));
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(getInitialTaskSubmissions);
  const [activities, setActivities] = useState<Activity[]>(() => getInitialActivitiesByCourseId(courseId, { publishedOnly: true }));
  const [activityAttempts, setActivityAttempts] = useState<ActivityAttempt[]>(getInitialActivityAttempts);
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(!isFirebaseDataSource());
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getCourseByIdAsync(courseId, "student"),
      getNotesByCourseIdAsync(courseId, { publishedOnly: true }),
      getTasksByCourseIdAsync(courseId, { publishedOnly: true }),
      getTaskSubmissionsAsync(),
      getActivitiesByCourseIdAsync(courseId, { publishedOnly: true }),
      getActivityAttemptsAsync()
    ])
      .then(([nextCourse, nextNotes, nextTasks, nextSubmissions, nextActivities, nextActivityAttempts]) => {
        if (isActive) {
          setCourse(nextCourse);
          setNotes(nextNotes);
          setTasks(nextTasks);
          setSubmissions(nextSubmissions);
          setActivities(nextActivities);
          setActivityAttempts(nextActivityAttempts);
          setCourseError("");
        }
      })
      .catch(() => {
        if (isActive) {
          setCourse(undefined);
          setCourseError("No pudimos cargar este curso.");
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
        title={courseError ? "Error al cargar curso" : "Curso no encontrado"}
        subtitle={courseError || "No pudimos encontrar el curso solicitado."}
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
        <DashboardCard label="Tareas pendientes" value={String(Math.max(course.pendingTasksCount, tasks.length))} helper="Por completar" />
        <DashboardCard label="Actividades" value={String(Math.max(course.pendingActivitiesCount, activities.length))} helper="Asignadas" />
        <DashboardCard label="Contenidos" value={String(Math.max(course.contentsCount, notes.length))} helper="Disponibles" />
      </section>

      <section className="mt-8 flex flex-col gap-3 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="m-0 text-xl font-extrabold text-neutral-black">Asistencia</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">Consulta tu resumen y el historial registrado para este curso.</p>
        </div>
        <Link
          href={`/student/courses/${courseId}/attendance`}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver asistencia
        </Link>
      </section>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <CoursePreviewList emptyLabel="Aún no hay contenidos recientes." items={createNotePreviewItems(courseId, notes)} title="Contenidos recientes" />
        <CoursePreviewList emptyLabel="No tienes tareas pendientes." items={createTaskPreviewItems(courseId, tasks, submissions)} title="Tareas pendientes" />
        <CoursePreviewList
          emptyLabel="No tienes actividades por completar."
          items={createActivityPreviewItems(courseId, activities, activityAttempts)}
          title="Actividades por completar"
        />
      </div>
    </AppShell>
  );
}
