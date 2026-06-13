export type CourseRole = "teacher" | "student";
export type CourseStatus = "active" | "draft" | "completed";

export type CourseProgress = {
  label: string;
  value: number;
};

export type CoursePreviewItem = {
  detail: string;
  title: string;
};

export type Course = {
  activities: CoursePreviewItem[];
  activitiesCount: number;
  contents: CoursePreviewItem[];
  contentsCount: number;
  description: string;
  groupLabel: string;
  groupsCount: number;
  id: string;
  name: string;
  pendingActivitiesCount: number;
  pendingTasksCount: number;
  progress: CourseProgress;
  role: CourseRole;
  status: CourseStatus;
  studentsCount: number;
  tasks: CoursePreviewItem[];
  tasksCount: number;
  teacherName: string;
  updatedAtLabel: string;
};

export const teacherCourses: Course[] = [
  {
    id: "matematica-aplicada",
    name: "Matemática aplicada",
    description: "Funciones, práctica guiada y actividades de repaso para segundo semestre.",
    teacherName: "Laura Méndez",
    groupLabel: "Segundo semestre",
    groupsCount: 4,
    studentsCount: 36,
    tasksCount: 8,
    activitiesCount: 6,
    contentsCount: 12,
    pendingTasksCount: 5,
    pendingActivitiesCount: 2,
    progress: { label: "72%", value: 72 },
    role: "teacher",
    status: "active",
    updatedAtLabel: "Actualizado hoy",
    contents: [
      { title: "Guía de funciones", detail: "Documento principal de la unidad" },
      { title: "Ejercicios resueltos", detail: "Material de práctica para la semana" }
    ],
    tasks: [
      { title: "Ejercicios de funciones", detail: "Vence el viernes" },
      { title: "Problemas aplicados", detail: "Pendiente de revisión" }
    ],
    activities: [
      { title: "Pregunta rápida de dominio", detail: "Asignada a 4 grupos" },
      { title: "Encuesta de comprensión", detail: "Resultados disponibles" }
    ]
  },
  {
    id: "historia-contemporanea",
    name: "Historia contemporánea",
    description: "Notas de clase, tareas de lectura y encuestas asincrónicas por unidad.",
    teacherName: "Diego Rojas",
    groupLabel: "Paralelo B",
    groupsCount: 3,
    studentsCount: 42,
    tasksCount: 6,
    activitiesCount: 5,
    contentsCount: 10,
    pendingTasksCount: 4,
    pendingActivitiesCount: 1,
    progress: { label: "58%", value: 58 },
    role: "teacher",
    status: "active",
    updatedAtLabel: "Hace 2 horas",
    contents: [
      { title: "Lectura guiada", detail: "Unidad de transformaciones sociales" },
      { title: "Línea de tiempo", detail: "Material de apoyo visual" }
    ],
    tasks: [
      { title: "Resumen de lectura", detail: "Vence el lunes" },
      { title: "Análisis comparativo", detail: "En progreso" }
    ],
    activities: [
      { title: "Verdadero o falso", detail: "Disponible hasta mañana" },
      { title: "Encuesta de cierre", detail: "Sin publicar" }
    ]
  },
  {
    id: "comunicacion-escrita",
    name: "Comunicación escrita",
    description: "Talleres, entregas semanales y seguimiento de avances por estudiante.",
    teacherName: "Carla Pérez",
    groupLabel: "Paralelo A",
    groupsCount: 2,
    studentsCount: 28,
    tasksCount: 9,
    activitiesCount: 4,
    contentsCount: 8,
    pendingTasksCount: 3,
    pendingActivitiesCount: 1,
    progress: { label: "81%", value: 81 },
    role: "teacher",
    status: "active",
    updatedAtLabel: "Ayer",
    contents: [
      { title: "Estructura del ensayo", detail: "Guía de escritura base" },
      { title: "Rúbrica de revisión", detail: "Criterios de evaluación" }
    ],
    tasks: [
      { title: "Borrador del ensayo", detail: "Vence el jueves" },
      { title: "Retroalimentación entre pares", detail: "Pendiente" }
    ],
    activities: [
      { title: "Pregunta de cierre", detail: "Toma 5 minutos" },
      { title: "Autoevaluación", detail: "Asignada al grupo" }
    ]
  }
];

export const studentCourses: Course[] = teacherCourses.map((course) => ({
  ...course,
  role: "student",
  pendingTasksCount: Math.max(1, Math.round(course.pendingTasksCount / 2)),
  pendingActivitiesCount: Math.max(1, course.pendingActivitiesCount),
  progress: {
    label: course.progress.label,
    value: course.progress.value
  }
}));

export function findCourseById(courseId: string, courses: Course[] = teacherCourses) {
  return courses.find((course) => course.id === courseId);
}
