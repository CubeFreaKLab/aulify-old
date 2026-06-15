"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getStudentActivityState,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import {
  getActivitiesAsync,
  getActivityAttemptsAsync,
  getInitialActivities,
  getInitialActivityAttempts
} from "../../lib/repositories/activityRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { ActivitiesList } from "./ActivitiesList";

export function StudentActivitiesOverview() {
  const [activities, setActivities] = useState<Activity[]>(() => (isFirebaseDataSource() ? [] : getInitialActivities({ publishedOnly: true })));
  const [attempts, setAttempts] = useState<ActivityAttempt[]>(() => (isFirebaseDataSource() ? [] : getInitialActivityAttempts()));
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("student")));
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([getActivitiesAsync({ publishedOnly: true }), getActivityAttemptsAsync(), getCoursesAsync("student")])
      .then(([nextActivities, nextAttempts, nextCourses]) => {
        if (isActive) {
          setActivities(nextActivities);
          setAttempts(nextAttempts);
          setCourses(nextCourses);
          setError("");
        }
      })
      .catch(() => {
        if (isActive) {
          setError("No se pudo cargar la actividad.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const courseNames = useMemo(() => new Map(courses.map((course) => [course.id, course.name])), [courses]);

  return (
    <div className="grid gap-5">
      {isLoading ? (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
          <p className="m-0 text-base font-medium text-neutral-darkGray">Cargando actividades...</p>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
          <p className="m-0 text-base font-medium text-neutral-darkGray">{error}</p>
        </section>
      ) : null}

      {!isLoading && !error ? (
        <ActivitiesList
          activities={activities}
          emptyLabel="No tienes actividades publicadas por ahora."
          getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
          getHref={(activity) => `/student/courses/${activity.courseId}/activities/${activity.id}`}
          getStudentState={(activity) => getStudentActivityState(activity, attempts)}
          variant="student"
        />
      ) : null}
    </div>
  );
}
