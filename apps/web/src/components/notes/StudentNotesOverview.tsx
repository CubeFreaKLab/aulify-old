"use client";

import { useEffect, useMemo, useState } from "react";
import { getCourses, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { getInitialNotes, getNotes, type Note } from "../../lib/repositories/noteRepository";
import { NotesList } from "./NotesList";

export function StudentNotesOverview() {
  const [notes, setNotes] = useState<Note[]>(getInitialNotes({ publishedOnly: true }));
  const [courses, setCourses] = useState<Course[]>(getInitialCourses("student"));

  useEffect(() => {
    setNotes(getNotes({ publishedOnly: true }));
    setCourses(getCourses("student"));
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
