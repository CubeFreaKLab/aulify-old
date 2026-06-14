"use client";

import { useEffect, useMemo, useState } from "react";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCoursesAsync, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import {
  getInitialTaskSubmissions,
  getInitialTasks,
  getTaskSubmissionsAsync,
  getTasksAsync,
  type Task,
  type TaskSubmission
} from "../../lib/repositories/taskRepository";
import { TasksList } from "./TasksList";

export function TeacherTasksOverview() {
  const [tasks, setTasks] = useState<Task[]>(() => (isFirebaseDataSource() ? [] : getInitialTasks()));
  const [courses, setCourses] = useState<Course[]>(() => (isFirebaseDataSource() ? [] : getInitialCourses("teacher")));
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => (isFirebaseDataSource() ? [] : getInitialTaskSubmissions()));
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource());
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([getTasksAsync(), getCoursesAsync("teacher"), getTaskSubmissionsAsync()])
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
  const coursesWithTasks = useMemo(() => courses.filter((course) => tasks.some((task) => task.courseId === course.id)), [courses, tasks]);
  const filteredTasks = selectedCourseId === "all" ? tasks : tasks.filter((task) => task.courseId === selectedCourseId);

  function getSubmissionsCount(taskId: string) {
    return submissions.filter((submission) => submission.taskId === taskId).length;
  }

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

      <section className="flex flex-wrap gap-2" aria-label="Filtrar tareas por curso">
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
        {coursesWithTasks.map((course) => {
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
        <TasksList
          actionLabel="Ver tarea"
          emptyLabel="Aún no hay tareas creadas para este curso."
          getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
          getHref={(task) => `/teacher/courses/${task.courseId}/tasks/${task.id}`}
          getSubmissionsCount={getSubmissionsCount}
          tasks={filteredTasks}
          variant="teacher"
        />
      ) : null}
    </div>
  );
}
