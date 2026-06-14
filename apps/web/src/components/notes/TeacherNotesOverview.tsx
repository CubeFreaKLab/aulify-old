"use client";

import { useEffect, useMemo, useState } from "react";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNotes, getNotesAsync, type Note } from "../../lib/repositories/noteRepository";
import { NotesList } from "./NotesList";

export function TeacherNotesOverview() {
  const [notes, setNotes] = useState<Note[]>(() => (isFirebaseDataSource() ? [] : getInitialNotes()));
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("teacher")));
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([getNotesAsync(), getCoursesAsync("teacher")])
      .then(([nextNotes, nextCourses]) => {
        if (isActive) {
          setNotes(nextNotes);
          setCourses(nextCourses);
          setError("");
        }
      })
      .catch(() => {
        if (isActive) {
          setError("No se pudo cargar la información.");
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
  const coursesWithNotes = useMemo(() => courses.filter((course) => notes.some((note) => note.courseId === course.id)), [courses, notes]);
  const filteredNotes = selectedCourseId === "all" ? notes : notes.filter((note) => note.courseId === selectedCourseId);

  return (
    <div className="grid gap-5">
      {isLoading ? (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
          <p className="m-0 text-base font-medium text-neutral-darkGray">Cargando notas...</p>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
          <p className="m-0 text-base font-medium text-neutral-darkGray">{error}</p>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-2" aria-label="Filtrar notas por curso">
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
        {coursesWithNotes.map((course) => {
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
        <NotesList
          actionLabel="Ver nota"
          emptyLabel="Aún no hay notas creadas para este curso."
          getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
          getHref={(note) => `/teacher/courses/${note.courseId}/notes/${note.id}`}
          notes={filteredNotes}
          showStatus
        />
      ) : null}
    </div>
  );
}
