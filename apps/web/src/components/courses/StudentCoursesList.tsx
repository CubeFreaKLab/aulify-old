"use client";

import { type FormEvent, useEffect, useState } from "react";
import { CourseCard } from "./CourseCard";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, joinCourseByCode, type Course } from "../../lib/repositories/courseRepository";

export function StudentCoursesList() {
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("student")));
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const canJoinByCode = isFirebaseDataSource();

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    void getCoursesAsync("student")
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

  async function handleJoinCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!joinCode.trim()) {
      setError("Ingresa el código del curso.");
      return;
    }

    setIsJoining(true);

    try {
      const course = await joinCourseByCode(joinCode);
      const nextCourses = await getCoursesAsync("student");
      setCourses(nextCourses);
      setJoinCode("");
      setError("");
      setMessage(`Te uniste a ${course.name}.`);
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "No pudimos unirte al curso.");
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <div className="grid gap-5">
      {canJoinByCode ? (
        <form
          className="flex flex-col gap-3 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:flex-row sm:items-end"
          noValidate
          onSubmit={handleJoinCourse}
        >
          <label className="grid flex-1 gap-2 text-sm font-bold text-neutral-black">
            Unirse a curso por código
            <input
              className="h-12 rounded-full border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium uppercase text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
              onChange={(event) => {
                setJoinCode(event.target.value.toUpperCase());
                setError("");
                setMessage("");
              }}
              placeholder="Ej. AUL123"
              value={joinCode}
            />
          </label>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            disabled={isJoining}
            type="submit"
          >
            {isJoining ? "Uniendo..." : "Unirme"}
          </button>
        </form>
      ) : null}

      {message ? <p className="m-0 rounded-3xl border border-brand-green bg-brand-greenLight px-5 py-4 text-sm font-bold text-neutral-black">{message}</p> : null}
      {error ? <p className="m-0 rounded-3xl border border-[#E5484D] bg-neutral-white px-5 py-4 text-sm font-bold text-[#E5484D]">{error}</p> : null}

      {isLoading ? (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Cargando cursos...
        </section>
      ) : courses.length ? (
        <section className="grid gap-4 xl:grid-cols-3" aria-label="Cursos inscritos">
          {courses.map((course) => (
            <CourseCard actionLabel="Entrar" course={course} href={`/student/courses/${course.id}`} key={course.id} mode="student" />
          ))}
        </section>
      ) : (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Aún no estás inscrito en cursos.
        </section>
      )}
    </div>
  );
}
