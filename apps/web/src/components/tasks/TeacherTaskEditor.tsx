"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { TaskForm } from "./TaskForm";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialTaskById, getTaskById, type Task } from "../../lib/repositories/taskRepository";

type TeacherTaskEditorProps = {
  courseId: string;
  taskId: string;
};

export function TeacherTaskEditor({ courseId, taskId }: TeacherTaskEditorProps) {
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "teacher"));
  const [task, setTask] = useState<Task | undefined>(() => getInitialTaskById(courseId, taskId));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    setCourse(getCourseById(courseId, "teacher"));
    setTask(getTaskById(courseId, taskId));
    setHasLoadedStoredData(true);
  }, [courseId, taskId]);

  if ((!course || !task) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/tasks"
        role="teacher"
        title="Cargando práctica"
        subtitle="Estamos preparando el editor."
        primaryAction={
          <Link
            href={`/teacher/courses/${courseId}/tasks/${taskId}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black"
          >
            Volver a la tarea
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Cargando información...
        </div>
      </AppShell>
    );
  }

  if (!course || !task) {
    return (
      <AppShell
        activeHref="/teacher/tasks"
        role="teacher"
        title="Tarea no encontrada"
        subtitle="No pudimos encontrar la tarea solicitada."
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
          Revisa las tareas del curso para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/teacher/tasks"
      role="teacher"
      title="Editar práctica"
      subtitle={`${course.name} · ${task.title}`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}/tasks/${task.id}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
      }
    >
      <div className="max-w-4xl">
        <TaskForm courseId={courseId} task={task} />
      </div>
    </AppShell>
  );
}
