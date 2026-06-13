"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "./CourseCard";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { teacherCourses, type Course } from "../../lib/mock/courses";

export function TeacherCoursesList() {
  const [courses, setCourses] = useState<Course[]>(teacherCourses);

  useEffect(() => {
    setCourses([...readStoredTeacherCourses(), ...teacherCourses]);
  }, []);

  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Cursos del profesor">
      {courses.map((course) => (
        <CourseCard actionLabel="Ver curso" course={course} href={`/teacher/courses/${course.id}`} key={course.id} mode="teacher" />
      ))}
    </section>
  );
}
