"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "./CourseCard";
import { getCourses, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";

export function TeacherCoursesList() {
  const [courses, setCourses] = useState<Course[]>(getInitialCourses("teacher"));

  useEffect(() => {
    setCourses(getCourses("teacher"));
  }, []);

  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Cursos del profesor">
      {courses.map((course) => (
        <CourseCard actionLabel="Ver curso" course={course} href={`/teacher/courses/${course.id}`} key={course.id} mode="teacher" />
      ))}
    </section>
  );
}
