"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { TaskDetail } from "./TaskDetail";
import { TaskSubmissionsList } from "./TaskSubmissionsList";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNoteById, getNoteByIdAsync, type Note } from "../../lib/repositories/noteRepository";
import {
  getInitialTaskById,
  getInitialTaskSubmissions,
  getTaskByIdAsync,
  getTaskSubmissionsByTaskIdAsync,
  type Task,
  type TaskSubmission
} from "../../lib/repositories/taskRepository";

type TeacherTaskDetailProps = {
  courseId: string;
  taskId: string;
};

export function TeacherTaskDetail({ courseId, taskId }: TeacherTaskDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "teacher")));
  const [task, setTask] = useState<Task | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialTaskById(courseId, taskId)));
  const [relatedNote, setRelatedNote] = useState<Note | undefined>(() => {
    if (isFirebaseDataSource()) {
      return undefined;
    }

    const initialTask = getInitialTaskById(courseId, taskId);
    return initialTask?.relatedNoteId ? getInitialNoteById(courseId, initialTask.relatedNoteId) : undefined;
  });
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() =>
    isFirebaseDataSource() ? [] : getInitialTaskSubmissions().filter((submission) => submission.taskId === taskId)
  );
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(!isFirebaseDataSource());

  useEffect(() => {
    let isActive = true;

    void Promise.all([getCourseByIdAsync(courseId, "teacher"), getTaskByIdAsync(courseId, taskId), getTaskSubmissionsByTaskIdAsync(taskId)])
      .then(async ([nextCourse, nextTask, nextSubmissions]) => {
        const nextRelatedNote = nextTask?.relatedNoteId ? await getNoteByIdAsync(courseId, nextTask.relatedNoteId) : undefined;

        if (isActive) {
          setCourse(nextCourse);
          setTask(nextTask);
          setRelatedNote(nextRelatedNote);
          setSubmissions(nextSubmissions);
        }
      })
      .catch(() => {
        if (isActive) {
          setCourse(undefined);
          setTask(undefined);
          setRelatedNote(undefined);
          setSubmissions([]);
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
  }, [courseId, taskId]);

  if ((!course || !task) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/tasks"
        role="teacher"
        title="Cargando tarea"
        subtitle="Estamos preparando la información de la tarea."
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
      title="Tarea"
      subtitle={course.name}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <TaskDetail
        courseName={course.name}
        relatedNoteTitle={relatedNote?.title}
        task={task}
        teacherActions={
          <>
            <Link
              href={`/teacher/courses/${courseId}/tasks/${task.id}/edit`}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              Editar práctica
            </Link>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-green px-4 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              Publicar
            </button>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-4 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              Cerrar tarea
            </button>
          </>
        }
      />
      <TaskSubmissionsList submissions={submissions} />
    </AppShell>
  );
}
