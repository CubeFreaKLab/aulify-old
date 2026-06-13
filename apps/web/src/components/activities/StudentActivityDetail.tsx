"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { ActivityAnswerForm } from "./ActivityAnswerForm";
import {
  getActivityById,
  getCurrentStudentAttempt,
  getInitialActivityById,
  getInitialCurrentStudentAttempt,
  type Activity,
  type ActivityAttempt
} from "../../lib/repositories/activityRepository";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";

type StudentActivityDetailProps = {
  activityId: string;
  courseId: string;
};

export function StudentActivityDetail({ activityId, courseId }: StudentActivityDetailProps) {
  const [activity, setActivity] = useState<Activity | undefined>(() => getInitialActivityById(courseId, activityId, { publishedOnly: true }));
  const [attempt, setAttempt] = useState<ActivityAttempt | undefined>(() => getInitialCurrentStudentAttempt(activityId));
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "student"));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    setActivity(getActivityById(courseId, activityId, { publishedOnly: true }));
    setAttempt(getCurrentStudentAttempt(activityId));
    setCourse(getCourseById(courseId, "student"));
    setHasLoadedStoredData(true);
  }, [activityId, courseId]);

  if ((!activity || !course) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/student/activities"
        role="student"
        title="Cargando actividad"
        subtitle="Estamos preparando la información de la actividad."
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

  if (!activity || !course) {
    return (
      <AppShell
        activeHref="/student/activities"
        role="student"
        title="Actividad no encontrada"
        subtitle="No pudimos encontrar una actividad publicada para este curso."
        primaryAction={
          <Link
            href="/student/activities"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver a actividades
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa las actividades publicadas en tus cursos para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/student/activities"
      role="student"
      title={activity.title}
      subtitle={`${course.name} · ${activity.description}`}
      primaryAction={
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <ActivityAnswerForm activity={activity} existingAttempt={attempt} />
    </AppShell>
  );
}
