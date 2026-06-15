"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoursePreviewList } from "./CoursePreviewList";
import { AppShell } from "../app/AppShell";
import { DashboardCard } from "../app/DashboardCard";
import {
  activityStatusLabels,
  activityTypeLabels,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import {
  getActivitiesByCourseIdAsync,
  getActivityAttemptsAsync,
  getInitialActivitiesByCourseId,
  getInitialActivityAttempts
} from "../../lib/repositories/activityRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { noteStatusLabels, type Note } from "../../lib/mock/notes";
import { formatTaskDate, taskStatusLabels, type Task, type TaskSubmission } from "../../lib/mock/tasks";
import { getInitialNotesByCourseId, getNotesByCourseIdAsync } from "../../lib/repositories/noteRepository";
import {
  getInitialTaskSubmissions,
  getInitialTasksByCourseId,
  getTaskSubmissionsAsync,
  getTasksByCourseIdAsync
} from "../../lib/repositories/taskRepository";

type TeacherCourseDetailProps = {
  courseId: string;
};

export function TeacherCourseDetail({ courseId }: TeacherCourseDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "teacher")));
  const [notes, setNotes] = useState<Note[]>(() => getInitialNotesByCourseId(courseId));
  const [tasks, setTasks] = useState<Task[]>(() => getInitialTasksByCourseId(courseId));
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(getInitialTaskSubmissions);
  const [activities, setActivities] = useState<Activity[]>(() => getInitialActivitiesByCourseId(courseId));
  const [activityAttempts, setActivityAttempts] = useState<ActivityAttempt[]>(getInitialActivityAttempts);
  const [hasLoadedStoredCourses, setHasLoadedStoredCourses] = useState(!isFirebaseDataSource());
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getCourseByIdAsync(courseId, "teacher"),
      getNotesByCourseIdAsync(courseId),
      getTasksByCourseIdAsync(courseId),
      getTaskSubmissionsAsync(),
      getActivitiesByCourseIdAsync(courseId),
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
          setHasLoadedStoredCourses(true);
        }
      });
    return () => {
      isActive = false;
    };
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
        title={courseError ? "Error al cargar curso" : "Curso no encontrado"}
        subtitle={courseError || "No pudimos encontrar el curso solicitado."}
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
        <DashboardCard label="Contenidos" value={String(Math.max(course.contentsCount, notes.length))} helper="Materiales publicados" />
        <DashboardCard label="Tareas" value={String(Math.max(course.tasksCount, tasks.length))} helper="Asignaciones activas" />
        <DashboardCard label="Actividades" value={String(Math.max(course.activitiesCount, activities.length))} helper={course.updatedAtLabel} />
      </section>

      <section className="mt-8 flex flex-wrap gap-3">
        {course.joinCode ? (
          <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-lightGray bg-neutral-white px-5 text-sm font-bold text-neutral-black">
            Código: <span className="ml-2 text-brand-green">{course.joinCode}</span>
          </div>
        ) : null}
        <Link
          href={`/teacher/courses/${courseId}/notes/new`}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Agregar contenido
        </Link>
        <Link
          href={`/teacher/courses/${courseId}/tasks/new`}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Crear tarea
        </Link>
        <Link
          href={`/teacher/courses/${courseId}/activities/new`}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Crear actividad
        </Link>
        <Link
          href={`/teacher/courses/${courseId}/attendance`}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Asistencia
        </Link>
      </section>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <CoursePreviewList
          emptyLabel="Aún no hay contenidos en este curso."
          items={notes.map((note) => ({
            title: note.title,
            detail: `${noteStatusLabels[note.status]} · ${note.summary}`,
            href: `/teacher/courses/${courseId}/notes/${note.id}`
          }))}
          title="Contenidos"
        />
        <CoursePreviewList
          emptyLabel="Aún no hay tareas en este curso."
          items={tasks.map((task) => {
            const submissionsCount = submissions.filter((submission) => submission.taskId === task.id).length;

            return {
              title: task.title,
              detail: `${taskStatusLabels[task.status]} · ${formatTaskDate(task.dueDate)} · ${submissionsCount} entregas`,
              href: `/teacher/courses/${courseId}/tasks/${task.id}`
            };
          })}
          title="Tareas"
        />
        <CoursePreviewList
          emptyLabel="Aún no hay actividades en este curso."
          items={activities.map((activity) => {
            const responsesCount = activityAttempts.filter((attempt) => attempt.activityId === activity.id).length;

            return {
              title: activity.title,
              detail: `${activityTypeLabels[activity.type]} · ${activityStatusLabels[activity.status]} · ${responsesCount} respuestas`,
              href: `/teacher/courses/${courseId}/activities/${activity.id}`
            };
          })}
          title="Actividades"
        />
      </div>
    </AppShell>
  );
}
