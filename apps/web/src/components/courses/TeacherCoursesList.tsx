"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "./CourseCard";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";

export function TeacherCoursesList() {
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("teacher")));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    void getCoursesAsync("teacher")
      .then((nextCourses) => {
        if (isActive) {
          setCourses(nextCourses);
          setError("");
        }
      })
      .catch(() => {
        if (isActive) {
          setError("No pudimos cargar tus cursos.");
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

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
        Cargando cursos...
      </section>
    );
  }

  if (error) {
    return <section className="rounded-3xl border border-[#E5484D] bg-neutral-white p-6 text-base font-semibold text-[#E5484D]">{error}</section>;
  }

  if (!courses.length) {
    return (
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
        Aún no tienes cursos creados.
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Cursos del profesor">
      {courses.map((course) => (
        <CourseCard actionLabel="Ver curso" course={course} href={`/teacher/courses/${course.id}`} key={course.id} mode="teacher" />
      ))}
    </section>
  );
}
