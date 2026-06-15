"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { ActivityAnswerForm } from "./ActivityAnswerForm";
import {
  getActivityByIdAsync,
  getCurrentStudentAttemptAsync,
  getInitialActivityById,
  getInitialCurrentStudentAttempt,
  type Activity,
  type ActivityAttempt
} from "../../lib/repositories/activityRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";

type StudentActivityDetailProps = {
  activityId: string;
  courseId: string;
};

export function StudentActivityDetail({ activityId, courseId }: StudentActivityDetailProps) {
  const [activity, setActivity] = useState<Activity | undefined>(() =>
    isFirebaseDataSource() ? undefined : getInitialActivityById(courseId, activityId, { publishedOnly: true })
  );
  const [attempt, setAttempt] = useState<ActivityAttempt | undefined>(() =>
    isFirebaseDataSource() ? undefined : getInitialCurrentStudentAttempt(activityId)
  );
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "student")));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(!isFirebaseDataSource());

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getActivityByIdAsync(courseId, activityId, { publishedOnly: true }),
      getCurrentStudentAttemptAsync(activityId),
      getCourseByIdAsync(courseId, "student")
    ])
      .then(([nextActivity, nextAttempt, nextCourse]) => {
        if (isActive) {
          setActivity(nextActivity);
          setAttempt(nextAttempt);
          setCourse(nextCourse);
        }
      })
      .catch(() => {
        if (isActive) {
          setActivity(undefined);
          setAttempt(undefined);
          setCourse(undefined);
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
        subtitle="No se pudo cargar la actividad."
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
