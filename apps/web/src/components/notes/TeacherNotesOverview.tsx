"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { mockNotes, type Note } from "../../lib/mock/notes";
import { teacherCourses, type Course } from "../../lib/mock/courses";
import { readStoredTeacherNotes } from "../../lib/noteStorage";
import { NotesList } from "./NotesList";

export function TeacherNotesOverview() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [courses, setCourses] = useState<Course[]>(teacherCourses);
  const [selectedCourseId, setSelectedCourseId] = useState("all");

  useEffect(() => {
    setNotes([...readStoredTeacherNotes(), ...mockNotes]);
    setCourses([...readStoredTeacherCourses(), ...teacherCourses]);
  }, []);

  const courseNames = useMemo(() => new Map(courses.map((course) => [course.id, course.name])), [courses]);
  const coursesWithNotes = useMemo(() => courses.filter((course) => notes.some((note) => note.courseId === course.id)), [courses, notes]);
  const filteredNotes = selectedCourseId === "all" ? notes : notes.filter((note) => note.courseId === selectedCourseId);

  return (
    <div className="grid gap-5">
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

      <NotesList
        actionLabel="Ver nota"
        emptyLabel="Aún no hay notas creadas para este curso."
        getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
        getHref={(note) => `/teacher/courses/${note.courseId}/notes/${note.id}`}
        notes={filteredNotes}
        showStatus
      />
    </div>
  );
}
