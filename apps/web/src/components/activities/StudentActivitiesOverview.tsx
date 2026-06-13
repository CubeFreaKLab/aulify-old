"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getStudentActivityState,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";
import {
  getActivities,
  getActivityAttempts,
  getInitialActivities,
  getInitialActivityAttempts
} from "../../lib/repositories/activityRepository";
import { getCourses, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { ActivitiesList } from "./ActivitiesList";

export function StudentActivitiesOverview() {
  const [activities, setActivities] = useState<Activity[]>(getInitialActivities({ publishedOnly: true }));
  const [attempts, setAttempts] = useState<ActivityAttempt[]>(getInitialActivityAttempts());
  const [courses, setCourses] = useState<Course[]>(getInitialCourses("student"));

  useEffect(() => {
    setActivities(getActivities({ publishedOnly: true }));
    setAttempts(getActivityAttempts());
    setCourses(getCourses("student"));
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
