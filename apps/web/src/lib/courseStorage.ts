import type { Course } from "./mock/courses";

const storedCoursesKey = "aulify.teacherCourses";

export type StoredCourseInput = {
  description: string;
  groupLabel: string;
  name: string;
};

function createCourseId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "curso"}-${Date.now()}`;
}

export function readStoredTeacherCourses(): Course[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(storedCoursesKey);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Course[];
  } catch {
    return [];
  }
}

export function createStoredTeacherCourse(input: StoredCourseInput) {
  const course: Course = {
    id: createCourseId(input.name),
    name: input.name.trim(),
    description: input.description.trim(),
    teacherName: "Equipo docente",
    groupLabel: input.groupLabel.trim() || "Sin grupo asignado",
    groupsCount: input.groupLabel.trim() ? 1 : 0,
    studentsCount: 0,
    tasksCount: 0,
    activitiesCount: 0,
    contentsCount: 0,
    pendingTasksCount: 0,
    pendingActivitiesCount: 0,
    progress: { label: "0%", value: 0 },
    role: "teacher",
    status: "draft",
    updatedAtLabel: "Creado ahora",
    contents: [],
    tasks: [],
    activities: []
  };

  const nextCourses = [course, ...readStoredTeacherCourses()];
  window.localStorage.setItem(storedCoursesKey, JSON.stringify(nextCourses));

  return course;
}
