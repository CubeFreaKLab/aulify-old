"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { TaskDetail } from "./TaskDetail";
import { TaskSubmissionForm } from "./TaskSubmissionForm";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNoteById, getNoteByIdAsync, type Note } from "../../lib/repositories/noteRepository";
import {
  getCurrentStudentTaskSubmissionAsync,
  getInitialCurrentStudentTaskSubmission,
  getInitialTaskById,
  getTaskByIdAsync,
  type Task,
  type TaskSubmission
} from "../../lib/repositories/taskRepository";

type StudentTaskDetailProps = {
  courseId: string;
  taskId: string;
};

export function StudentTaskDetail({ courseId, taskId }: StudentTaskDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "student")));
  const [task, setTask] = useState<Task | undefined>(() =>
    isFirebaseDataSource() ? undefined : getInitialTaskById(courseId, taskId, { publishedOnly: true })
  );
  const [relatedNote, setRelatedNote] = useState<Note | undefined>(() => {
    if (isFirebaseDataSource()) {
      return undefined;
    }

    const initialTask = getInitialTaskById(courseId, taskId, { publishedOnly: true });
    return initialTask?.relatedNoteId ? getInitialNoteById(courseId, initialTask.relatedNoteId) : undefined;
  });
  const [submission, setSubmission] = useState<TaskSubmission | undefined>(() =>
    isFirebaseDataSource() ? undefined : getInitialCurrentStudentTaskSubmission(taskId)
  );
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(!isFirebaseDataSource());

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getCourseByIdAsync(courseId, "student"),
      getTaskByIdAsync(courseId, taskId, { publishedOnly: true }),
      getCurrentStudentTaskSubmissionAsync(taskId)
    ])
      .then(async ([nextCourse, nextTask, nextSubmission]) => {
        const nextRelatedNote = nextTask?.relatedNoteId ? await getNoteByIdAsync(courseId, nextTask.relatedNoteId, { publishedOnly: true }) : undefined;

        if (isActive) {
          setCourse(nextCourse);
          setTask(nextTask);
          setRelatedNote(nextRelatedNote);
          setSubmission(nextSubmission);
        }
      })
      .catch(() => {
        if (isActive) {
          setCourse(undefined);
          setTask(undefined);
          setRelatedNote(undefined);
          setSubmission(undefined);
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
        activeHref="/student/tasks"
        role="student"
        title="Cargando tarea"
        subtitle="Estamos preparando la información de la tarea."
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

  if (!course || !task) {
    return (
      <AppShell
        activeHref="/student/tasks"
        role="student"
        title="Tarea no encontrada"
        subtitle="No pudimos encontrar una tarea publicada para este curso."
        primaryAction={
          <Link
            href="/student/tasks"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver a tareas
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa las tareas publicadas en tus cursos para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/student/tasks"
      role="student"
      title="Tarea"
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
      <TaskDetail courseName={course.name} relatedNoteTitle={relatedNote?.title} task={task} />
      <TaskSubmissionForm existingSubmission={submission} taskId={task.id} />
    </AppShell>
  );
}
