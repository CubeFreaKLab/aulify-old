"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { teacherCourses, type Course } from "../../lib/mock/courses";
import { mockTaskSubmissions, mockTasks, type Task, type TaskSubmission } from "../../lib/mock/tasks";
import { readStoredTaskSubmissions, readStoredTeacherTasks } from "../../lib/taskStorage";
import { TasksList } from "./TasksList";

export function TeacherTasksOverview() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [courses, setCourses] = useState<Course[]>(teacherCourses);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(mockTaskSubmissions);
  const [selectedCourseId, setSelectedCourseId] = useState("all");

  useEffect(() => {
    setTasks([...readStoredTeacherTasks(), ...mockTasks]);
    setCourses([...readStoredTeacherCourses(), ...teacherCourses]);
    setSubmissions([...readStoredTaskSubmissions(), ...mockTaskSubmissions]);
  }, []);

  const courseNames = useMemo(() => new Map(courses.map((course) => [course.id, course.name])), [courses]);
  const coursesWithTasks = useMemo(() => courses.filter((course) => tasks.some((task) => task.courseId === course.id)), [courses, tasks]);
  const filteredTasks = selectedCourseId === "all" ? tasks : tasks.filter((task) => task.courseId === selectedCourseId);

  function getSubmissionsCount(taskId: string) {
    return submissions.filter((submission) => submission.taskId === taskId).length;
  }

  return (
    <div className="grid gap-5">
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

      <TasksList
        actionLabel="Ver tarea"
        emptyLabel="Aún no hay tareas creadas para este curso."
        getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
        getHref={(task) => `/teacher/courses/${task.courseId}/tasks/${task.id}`}
        getSubmissionsCount={getSubmissionsCount}
        tasks={filteredTasks}
        variant="teacher"
      />
    </div>
  );
}
