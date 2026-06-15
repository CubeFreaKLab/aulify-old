"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getActivitiesAsync,
  getActivityAttemptsAsync,
  getInitialActivities,
  getInitialActivityAttempts,
  type Activity,
  type ActivityAttempt
} from "../../lib/repositories/activityRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { ActivitiesList } from "./ActivitiesList";

export function TeacherActivitiesOverview() {
  const [activities, setActivities] = useState<Activity[]>(() => (isFirebaseDataSource() ? [] : getInitialActivities()));
  const [attempts, setAttempts] = useState<ActivityAttempt[]>(() => (isFirebaseDataSource() ? [] : getInitialActivityAttempts()));
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("teacher")));
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([getActivitiesAsync(), getActivityAttemptsAsync(), getCoursesAsync("teacher")])
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
  const coursesWithActivities = useMemo(
    () => courses.filter((course) => activities.some((activity) => activity.courseId === course.id)),
    [activities, courses]
  );
  const filteredActivities =
    selectedCourseId === "all" ? activities : activities.filter((activity) => activity.courseId === selectedCourseId);

  function getResponsesCount(activityId: string) {
    return attempts.filter((attempt) => attempt.activityId === activityId).length;
  }

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

      <section className="flex flex-wrap gap-2" aria-label="Filtrar actividades por curso">
        <button
          type="button"
          className={[
            "min-h-10 rounded-full border px-4 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
            selectedCourseId === "all"
              ? "border-brand-green bg-brand-green text-neutral-white"
              : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
          ].join(" ")}
          onClick={() => setSelectedCourseId("all")}
        >
          Todos
        </button>
        {coursesWithActivities.map((course) => {
          const isSelected = course.id === selectedCourseId;

          return (
            <button
              type="button"
              className={[
                "min-h-10 rounded-full border px-4 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                isSelected
                  ? "border-brand-green bg-brand-green text-neutral-white"
                  : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
              ].join(" ")}
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
            >
              {course.name}
            </button>
          );
        })}
      </section>

      {!isLoading && !error ? (
        <ActivitiesList
          activities={filteredActivities}
          emptyLabel="Aún no hay actividades creadas para este curso."
          getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
          getHref={(activity) => `/teacher/courses/${activity.courseId}/activities/${activity.id}`}
          getResponsesCount={getResponsesCount}
          variant="teacher"
        />
      ) : null}
    </div>
  );
}
