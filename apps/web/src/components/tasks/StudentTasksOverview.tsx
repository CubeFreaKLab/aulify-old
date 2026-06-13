"use client";

import { useEffect, useMemo, useState } from "react";
import { getCourses, getInitialCourses, type Course } from "../../lib/repositories/courseRepository";
import { getStudentTaskState } from "../../lib/mock/tasks";
import { getInitialTaskSubmissions, getInitialTasks, getTaskSubmissions, getTasks, type Task, type TaskSubmission } from "../../lib/repositories/taskRepository";
import { TasksList } from "./TasksList";

export function StudentTasksOverview() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks({ publishedOnly: true }));
  const [courses, setCourses] = useState<Course[]>(getInitialCourses("student"));
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(getInitialTaskSubmissions());

  useEffect(() => {
    setTasks(getTasks({ publishedOnly: true }));
    setCourses(getCourses("student"));
    setSubmissions(getTaskSubmissions());
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
