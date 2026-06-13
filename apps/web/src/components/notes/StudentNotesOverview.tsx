"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { getPublishedNotes, mockNotes, type Note } from "../../lib/mock/notes";
import { studentCourses, type Course } from "../../lib/mock/courses";
import { readStoredTeacherNotes } from "../../lib/noteStorage";
import { NotesList } from "./NotesList";

export function StudentNotesOverview() {
  const [notes, setNotes] = useState<Note[]>(getPublishedNotes(mockNotes));
  const [courses, setCourses] = useState<Course[]>(studentCourses);

  useEffect(() => {
    setNotes(getPublishedNotes([...readStoredTeacherNotes(), ...mockNotes]));
    setCourses([...readStoredTeacherCourses(), ...studentCourses]);
  }, []);

  const courseNames = useMemo(() => new Map(courses.map((course) => [course.id, course.name])), [courses]);

  return (
    <NotesList
      actionLabel="Leer nota"
      emptyLabel="Aún no hay notas publicadas en tus cursos."
      getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
      getHref={(note) => `/student/courses/${note.courseId}/notes/${note.id}`}
      notes={notes}
      showStatus={false}
    />
  );
}
