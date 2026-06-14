"use client";

import { useEffect, useMemo, useState } from "react";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNotes, getNotesAsync, type Note } from "../../lib/repositories/noteRepository";
import { NotesList } from "./NotesList";

export function StudentNotesOverview() {
  const [notes, setNotes] = useState<Note[]>(() => (isFirebaseDataSource() ? [] : getInitialNotes({ publishedOnly: true })));
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("student")));
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([getNotesAsync({ publishedOnly: true }), getCoursesAsync("student")])
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

      {!isLoading && !error ? (
        <NotesList
          actionLabel="Leer nota"
          emptyLabel="Aún no hay notas publicadas en tus cursos."
          getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
          getHref={(note) => `/student/courses/${note.courseId}/notes/${note.id}`}
          notes={notes}
          showStatus={false}
        />
      ) : null}
    </div>
  );
}
