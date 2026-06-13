"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { TaskDetail } from "./TaskDetail";
import { TaskSubmissionsList } from "./TaskSubmissionsList";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { findCourseById, teacherCourses, type Course } from "../../lib/mock/courses";
import { findNoteById, mockNotes, type Note } from "../../lib/mock/notes";
import { findTaskById, mockTaskSubmissions, mockTasks, type Task, type TaskSubmission } from "../../lib/mock/tasks";
import { readStoredTeacherNotes } from "../../lib/noteStorage";
import { readStoredTaskSubmissions, readStoredTeacherTasks } from "../../lib/taskStorage";

type TeacherTaskDetailProps = {
  courseId: string;
  taskId: string;
};

export function TeacherTaskDetail({ courseId, taskId }: TeacherTaskDetailProps) {
  const [course, setCourse] = useState<Course | undefined>(() => findCourseById(courseId));
  const [task, setTask] = useState<Task | undefined>(() => findTaskById(courseId, taskId));
  const [relatedNote, setRelatedNote] = useState<Note | undefined>(() => {
    const initialTask = findTaskById(courseId, taskId);
    return initialTask?.relatedNoteId ? findNoteById(courseId, initialTask.relatedNoteId) : undefined;
  });
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() =>
    mockTaskSubmissions.filter((submission) => submission.taskId === taskId)
  );
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const courses = [...readStoredTeacherCourses(), ...teacherCourses];
    const tasks = [...readStoredTeacherTasks(), ...mockTasks];
    const notes = [...readStoredTeacherNotes(), ...mockNotes];
    const allSubmissions = [...readStoredTaskSubmissions(), ...mockTaskSubmissions];
    const nextTask = findTaskById(courseId, taskId, tasks);

    setCourse(findCourseById(courseId, courses));
    setTask(nextTask);
    setRelatedNote(nextTask?.relatedNoteId ? findNoteById(courseId, nextTask.relatedNoteId, notes) : undefined);
    setSubmissions(allSubmissions.filter((submission) => submission.taskId === taskId));
    setHasLoadedStoredData(true);
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
      title={task.title}
      subtitle={`${course.name} · ${task.description}`}
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
