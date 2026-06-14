"use client";

import { useEffect, useMemo, useState } from "react";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { getStudentTaskState } from "../../lib/mock/tasks";
import {
  getInitialTaskSubmissions,
  getInitialTasks,
  getTaskSubmissionsAsync,
  getTasksAsync,
  type Task,
  type TaskSubmission
} from "../../lib/repositories/taskRepository";
import { TasksList } from "./TasksList";

export function StudentTasksOverview() {
  const [tasks, setTasks] = useState<Task[]>(() => (isFirebaseDataSource() ? [] : getInitialTasks({ publishedOnly: true })));
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("student")));
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => (isFirebaseDataSource() ? [] : getInitialTaskSubmissions()));
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([getTasksAsync({ publishedOnly: true }), getCoursesAsync("student"), getTaskSubmissionsAsync()])
      .then(([nextTasks, nextCourses, nextSubmissions]) => {
        if (isActive) {
          setTasks(nextTasks);
          setCourses(nextCourses);
          setSubmissions(nextSubmissions);
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
          <p className="m-0 text-base font-medium text-neutral-darkGray">Cargando tareas...</p>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
          <p className="m-0 text-base font-medium text-neutral-darkGray">{error}</p>
        </section>
      ) : null}

      {!isLoading && !error ? (
        <TasksList
          actionLabel="Ver tarea"
          emptyLabel="No tienes tareas publicadas por ahora."
          getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
          getHref={(task) => `/student/courses/${task.courseId}/tasks/${task.id}`}
          getStudentState={(task) => getStudentTaskState(task, submissions)}
          tasks={tasks}
          variant="student"
        />
      ) : null}
    </div>
  );
}
