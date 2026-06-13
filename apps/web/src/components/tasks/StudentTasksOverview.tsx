"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { studentCourses, type Course } from "../../lib/mock/courses";
import {
  getPublishedTasks,
  getStudentTaskState,
  mockTaskSubmissions,
  mockTasks,
  type Task,
  type TaskSubmission
} from "../../lib/mock/tasks";
import { readStoredTaskSubmissions, readStoredTeacherTasks } from "../../lib/taskStorage";
import { TasksList } from "./TasksList";

export function StudentTasksOverview() {
  const [tasks, setTasks] = useState<Task[]>(getPublishedTasks(mockTasks));
  const [courses, setCourses] = useState<Course[]>(studentCourses);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(mockTaskSubmissions);

  useEffect(() => {
    setTasks(getPublishedTasks([...readStoredTeacherTasks(), ...mockTasks]));
    setCourses([...readStoredTeacherCourses(), ...studentCourses]);
    setSubmissions([...readStoredTaskSubmissions(), ...mockTaskSubmissions]);
  }, []);

  const courseNames = useMemo(() => new Map(courses.map((course) => [course.id, course.name])), [courses]);

  return (
    <TasksList
      actionLabel="Ver tarea"
      emptyLabel="No tienes tareas publicadas por ahora."
      getCourseName={(courseId) => courseNames.get(courseId) ?? "Curso sin nombre"}
      getHref={(task) => `/student/courses/${task.courseId}/tasks/${task.id}`}
      getStudentState={(task) => getStudentTaskState(task, submissions)}
      tasks={tasks}
      variant="student"
    />
  );
}
