"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { ActivityDetail } from "./ActivityDetail";
import { ActivityResults } from "./ActivityResults";
import { readStoredActivityAttempts, readStoredTeacherActivities } from "../../lib/activityStorage";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import {
  findActivityById,
  mockActivities,
  mockActivityAttempts,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import { findCourseById, teacherCourses, type Course } from "../../lib/mock/courses";

type TeacherActivityDetailProps = {
  activityId: string;
  courseId: string;
};

export function TeacherActivityDetail({ activityId, courseId }: TeacherActivityDetailProps) {
  const [activity, setActivity] = useState<Activity | undefined>(() => findActivityById(courseId, activityId));
  const [attempts, setAttempts] = useState<ActivityAttempt[]>(() =>
    mockActivityAttempts.filter((attempt) => attempt.activityId === activityId)
  );
  const [course, setCourse] = useState<Course | undefined>(() => findCourseById(courseId));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const activities = [...readStoredTeacherActivities(), ...mockActivities];
    const allAttempts = [...readStoredActivityAttempts(), ...mockActivityAttempts];
    const courses = [...readStoredTeacherCourses(), ...teacherCourses];

    setActivity(findActivityById(courseId, activityId, activities));
    setAttempts(allAttempts.filter((attempt) => attempt.activityId === activityId));
    setCourse(findCourseById(courseId, courses));
    setHasLoadedStoredData(true);
  }, [activityId, courseId]);

  if ((!activity || !course) && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/activities"
        role="teacher"
        title="Cargando actividad"
        subtitle="Estamos preparando la información de la actividad."
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

  if (!activity || !course) {
    return (
      <AppShell
        activeHref="/teacher/activities"
        role="teacher"
        title="Actividad no encontrada"
        subtitle="No pudimos encontrar la actividad solicitada."
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
          Revisa las actividades del curso para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/teacher/activities"
      role="teacher"
      title={activity.title}
      subtitle={`${course.name} · ${activity.description}`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <ActivityDetail
        activity={activity}
        courseName={course.name}
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
              Cerrar actividad
            </button>
          </>
        }
      />
      <ActivityResults activity={activity} attempts={attempts} />
    </AppShell>
  );
}
