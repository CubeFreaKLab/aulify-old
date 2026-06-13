"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import {
  getPublishedActivities,
  getStudentActivityState,
  mockActivities,
  mockActivityAttempts,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import { studentCourses, type Course } from "../../lib/mock/courses";
import { readStoredActivityAttempts, readStoredTeacherActivities } from "../../lib/activityStorage";
import { ActivitiesList } from "./ActivitiesList";

export function StudentActivitiesOverview() {
  const [activities, setActivities] = useState<Activity[]>(getPublishedActivities(mockActivities));
  const [attempts, setAttempts] = useState<ActivityAttempt[]>(mockActivityAttempts);
  const [courses, setCourses] = useState<Course[]>(studentCourses);

  useEffect(() => {
    setActivities(getPublishedActivities([...readStoredTeacherActivities(), ...mockActivities]));
    setAttempts([...readStoredActivityAttempts(), ...mockActivityAttempts]);
    setCourses([...readStoredTeacherCourses(), ...studentCourses]);
  }, []);

  const courseNames = useMemo(() => new Map(courses.map((course) => [course.id, course.name])), [courses]);

  return (
    <ActivitiesList
      activities={activities}
      emptyLabel="No tienes actividades publicadas por ahora."
      getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
      getHref={(activity) => `/student/courses/${activity.courseId}/activities/${activity.id}`}
      getStudentState={(activity) => getStudentActivityState(activity, attempts)}
      variant="student"
    />
  );
}
