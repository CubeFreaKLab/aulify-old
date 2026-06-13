"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import {
  mockActivities,
  mockActivityAttempts,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import { teacherCourses, type Course } from "../../lib/mock/courses";
import { readStoredActivityAttempts, readStoredTeacherActivities } from "../../lib/activityStorage";
import { ActivitiesList } from "./ActivitiesList";

export function TeacherActivitiesOverview() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [attempts, setAttempts] = useState<ActivityAttempt[]>(mockActivityAttempts);
  const [courses, setCourses] = useState<Course[]>(teacherCourses);
  const [selectedCourseId, setSelectedCourseId] = useState("all");

  useEffect(() => {
    setActivities([...readStoredTeacherActivities(), ...mockActivities]);
    setAttempts([...readStoredActivityAttempts(), ...mockActivityAttempts]);
    setCourses([...readStoredTeacherCourses(), ...teacherCourses]);
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

      <ActivitiesList
        activities={filteredActivities}
        emptyLabel="Aún no hay actividades creadas para este curso."
        getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
        getHref={(activity) => `/teacher/courses/${activity.courseId}/activities/${activity.id}`}
        getResponsesCount={getResponsesCount}
        variant="teacher"
      />
    </div>
  );
}
