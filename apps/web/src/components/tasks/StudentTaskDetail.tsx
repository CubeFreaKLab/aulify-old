"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { TaskDetail } from "./TaskDetail";
import { TaskSubmissionForm } from "./TaskSubmissionForm";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNoteById, getNoteById, type Note } from "../../lib/repositories/noteRepository";
import {
  getCurrentStudentTaskSubmission,
  getInitialCurrentStudentTaskSubmission,
  getInitialTaskById,
  getTaskById,
  type Task,
  type TaskSubmission
} from "../../lib/repositories/taskRepository";

type StudentTaskDetailProps = {
  courseId: string;
  taskId: string;
};

export function StudentTaskDetail({ courseId, taskId }: StudentTaskDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "student"));
  const [task, setTask] = useState<Task | undefined>(() => getInitialTaskById(courseId, taskId, { publishedOnly: true }));
  const [relatedNote, setRelatedNote] = useState<Note | undefined>(() => {
    const initialTask = getInitialTaskById(courseId, taskId, { publishedOnly: true });
    return initialTask?.relatedNoteId ? getInitialNoteById(courseId, initialTask.relatedNoteId) : undefined;
  });
  const [submission, setSubmission] = useState<TaskSubmission | undefined>(() => getInitialCurrentStudentTaskSubmission(taskId));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const nextTask = getTaskById(courseId, taskId, { publishedOnly: true });

    setCourse(getCourseById(courseId, "student"));
    setTask(nextTask);
    setRelatedNote(nextTask?.relatedNoteId ? getNoteById(courseId, nextTask.relatedNoteId) : undefined);
    setSubmission(getCurrentStudentTaskSubmission(taskId));
    setHasLoadedStoredData(true);
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
