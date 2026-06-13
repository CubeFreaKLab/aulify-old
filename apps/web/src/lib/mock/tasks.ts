export type TaskStatus = "draft" | "published" | "closed";
export type TaskSubmissionStatus = "submitted" | "reviewed";
export type StudentTaskState = "pending" | "submitted" | "overdue";

export type Task = {
  courseId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  instructions: string;
  points: number;
  relatedNoteId?: string;
  status: TaskStatus;
  title: string;
  updatedAt: string;
};

export type TaskSubmission = {
  content: string;
  feedback?: string;
  id: string;
  score?: number;
  status: TaskSubmissionStatus;
  studentEmail?: string;
  studentName: string;
  submittedAt: string;
  taskId: string;
};

export const currentStudentSubmissionIdentity = {
  email: "estudiante@aulify.local",
  name: "Estudiante Aulify"
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  draft: "Borrador",
  published: "Publicada",
  closed: "Cerrada"
};

export const submissionStatusLabels: Record<TaskSubmissionStatus, string> = {
  submitted: "Entregada",
  reviewed: "Revisada"
};

export const studentTaskStateLabels: Record<StudentTaskState, string> = {
  pending: "Pendiente",
  submitted: "Entregada",
  overdue: "Vencida"
};

export const mockTasks: Task[] = [
  {
    id: "ejercicios-funciones-lineales",
    courseId: "matematica-aplicada",
    title: "Ejercicios de funciones lineales",
    description: "Resuelve problemas de pendiente, intercepto y representación gráfica.",
    instructions:
      "Completa los ejercicios indicados en la guía de funciones lineales. Explica el procedimiento en cada respuesta y revisa que las unidades estén correctamente identificadas.",
    dueDate: "2026-06-20",
    status: "published",
    points: 100,
    relatedNoteId: "guia-funciones-lineales",
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-10T14:30:00.000Z"
  },
  {
    id: "problemas-aplicados",
    courseId: "matematica-aplicada",
    title: "Problemas aplicados",
    description: "Prepara un desarrollo breve para tres situaciones contextualizadas.",
    instructions:
      "Identifica variables, plantea la función y explica qué representa cada resultado. Adjunta el desarrollo escrito en el espacio de entrega.",
    dueDate: "2026-06-24",
    status: "draft",
    points: 80,
    relatedNoteId: "repaso-ejercicios-aplicados",
    createdAt: "2026-06-08T11:00:00.000Z",
    updatedAt: "2026-06-11T10:15:00.000Z"
  },
  {
    id: "resumen-transformaciones-sociales",
    courseId: "historia-contemporanea",
    title: "Resumen de lectura",
    description: "Sintetiza las ideas principales sobre transformaciones sociales del siglo XX.",
    instructions:
      "Lee la nota del curso, elige tres ideas centrales y redacta un resumen con ejemplos. Cierra con una pregunta para discutir en clase.",
    dueDate: "2026-06-18",
    status: "published",
    points: 50,
    relatedNoteId: "transformaciones-sociales",
    createdAt: "2026-05-30T13:20:00.000Z",
    updatedAt: "2026-06-08T16:45:00.000Z"
  },
  {
    id: "borrador-ensayo",
    courseId: "comunicacion-escrita",
    title: "Borrador del ensayo",
    description: "Entrega una primera versión con tesis, argumentos y cierre.",
    instructions:
      "Escribe un borrador de al menos cuatro párrafos. Revisa que cada argumento esté conectado con la tesis y agrega una breve reflexión final.",
    dueDate: "2026-06-22",
    status: "published",
    points: 100,
    relatedNoteId: "estructura-ensayo",
    createdAt: "2026-05-25T15:00:00.000Z",
    updatedAt: "2026-06-09T19:00:00.000Z"
  }
];

export const mockTaskSubmissions: TaskSubmission[] = [
  {
    id: "submission-ejercicios-funciones-ana",
    taskId: "ejercicios-funciones-lineales",
    studentName: "Ana Vargas",
    studentEmail: "ana.vargas@example.com",
    content: "Resolví los ejercicios 1 al 8 y agregué explicación en los problemas de pendiente.",
    submittedAt: "2026-06-12T17:20:00.000Z",
    status: "submitted"
  },
  {
    id: "submission-resumen-transformaciones-mateo",
    taskId: "resumen-transformaciones-sociales",
    studentName: "Mateo Flores",
    studentEmail: "mateo.flores@example.com",
    content: "Incluí tres ideas centrales y una pregunta sobre participación ciudadana.",
    submittedAt: "2026-06-10T20:10:00.000Z",
    status: "reviewed",
    score: 45,
    feedback: "Buen trabajo conectando ejemplos históricos con consecuencias sociales."
  }
];

export function getCourseTasks(courseId: string, tasks: Task[] = mockTasks) {
  return tasks.filter((task) => task.courseId === courseId);
}

export function getPublishedTasks(tasks: Task[] = mockTasks) {
  return tasks.filter((task) => task.status === "published");
}

export function findTaskById(courseId: string, taskId: string, tasks: Task[] = mockTasks) {
  return tasks.find((task) => task.courseId === courseId && task.id === taskId);
}

export function getTaskSubmissions(taskId: string, submissions: TaskSubmission[] = mockTaskSubmissions) {
  return submissions.filter((submission) => submission.taskId === taskId);
}

export function getCurrentStudentSubmission(taskId: string, submissions: TaskSubmission[] = mockTaskSubmissions) {
  return submissions.find(
    (submission) => submission.taskId === taskId && submission.studentEmail === currentStudentSubmissionIdentity.email
  );
}

export function getStudentTaskState(task: Task, submissions: TaskSubmission[] = mockTaskSubmissions): StudentTaskState {
  if (getCurrentStudentSubmission(task.id, submissions)) {
    return "submitted";
  }

  const today = new Date();
  const dueDate = new Date(`${task.dueDate}T23:59:59`);

  return dueDate < today ? "overdue" : "pending";
}

export function formatTaskDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}
