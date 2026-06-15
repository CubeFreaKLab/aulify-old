export type ActivityType = "quiz" | "true_false" | "quick_question" | "poll";
export type ActivityStatus = "draft" | "published" | "closed";
export type StudentActivityState = "pending" | "completed";

export type ActivityOption = {
  id: string;
  label: string;
};

export type ActivityQuestion = {
  correctBoolean?: boolean;
  correctOptionId?: string;
  id: string;
  options?: ActivityOption[];
  prompt: string;
};

export type Activity = {
  courseId: string;
  createdAt: string;
  createdBy?: string;
  description: string;
  id: string;
  questions: ActivityQuestion[];
  status: ActivityStatus;
  title: string;
  type: ActivityType;
  updatedAt: string;
};

export type ActivityAnswer = {
  booleanAnswer?: boolean;
  optionId?: string;
  questionId: string;
  text?: string;
};

export type ActivityAttempt = {
  activityId: string;
  answers: ActivityAnswer[];
  courseId?: string;
  id: string;
  score?: number;
  studentId?: string;
  studentName: string;
  submittedAt: string;
  updatedAt?: string;
};

export const currentStudentActivityIdentity = {
  name: "Estudiante Aulify"
};

export const activityTypeLabels: Record<ActivityType, string> = {
  quiz: "Quiz",
  true_false: "Verdadero/Falso",
  quick_question: "Pregunta rápida",
  poll: "Encuesta"
};

export const activityStatusLabels: Record<ActivityStatus, string> = {
  draft: "Borrador",
  published: "Publicada",
  closed: "Cerrada"
};

export const studentActivityStateLabels: Record<StudentActivityState, string> = {
  pending: "Pendiente",
  completed: "Completada"
};

export const mockActivities: Activity[] = [
  {
    id: "quiz-funciones-lineales",
    courseId: "matematica-aplicada",
    title: "Quiz de funciones lineales",
    description: "Comprueba la interpretación de pendiente e intercepto.",
    type: "quiz",
    status: "published",
    questions: [
      {
        id: "question-pendiente",
        prompt: "¿Qué representa la pendiente en una función lineal?",
        options: [
          { id: "option-a", label: "El cambio de la variable dependiente por cada unidad de la independiente" },
          { id: "option-b", label: "El punto donde la gráfica corta el eje horizontal" },
          { id: "option-c", label: "El valor máximo de la función" },
          { id: "option-d", label: "La cantidad total de ejercicios resueltos" }
        ],
        correctOptionId: "option-a"
      }
    ],
    createdAt: "2026-06-05T10:00:00.000Z",
    updatedAt: "2026-06-10T13:15:00.000Z"
  },
  {
    id: "verdadero-falso-transformaciones",
    courseId: "historia-contemporanea",
    title: "Verdadero o falso: transformaciones sociales",
    description: "Refuerza ideas clave de la lectura de la unidad.",
    type: "true_false",
    status: "published",
    questions: [
      {
        id: "question-transformaciones",
        prompt: "Las transformaciones sociales del siglo XX se relacionan solo con cambios tecnológicos.",
        correctBoolean: false
      }
    ],
    createdAt: "2026-06-03T09:30:00.000Z",
    updatedAt: "2026-06-09T16:40:00.000Z"
  },
  {
    id: "pregunta-cierre-ensayo",
    courseId: "comunicacion-escrita",
    title: "Pregunta de cierre del ensayo",
    description: "Comparte una reflexión breve sobre tu tesis.",
    type: "quick_question",
    status: "published",
    questions: [
      {
        id: "question-reflexion",
        prompt: "¿Qué parte de tu tesis necesita más evidencia antes de la entrega final?"
      }
    ],
    createdAt: "2026-06-04T14:00:00.000Z",
    updatedAt: "2026-06-08T11:10:00.000Z"
  },
  {
    id: "encuesta-ritmo-clase",
    courseId: "matematica-aplicada",
    title: "Encuesta sobre ritmo de clase",
    description: "Ayuda a ajustar el ritmo de práctica de la unidad.",
    type: "poll",
    status: "draft",
    questions: [
      {
        id: "question-ritmo",
        prompt: "¿Cómo sientes el ritmo actual de la clase?",
        options: [
          { id: "option-a", label: "Muy rápido" },
          { id: "option-b", label: "Adecuado" },
          { id: "option-c", label: "Necesito más práctica" }
        ]
      }
    ],
    createdAt: "2026-06-11T10:00:00.000Z",
    updatedAt: "2026-06-11T10:00:00.000Z"
  }
];

export const mockActivityAttempts: ActivityAttempt[] = [
  {
    id: "attempt-quiz-funciones-ana",
    activityId: "quiz-funciones-lineales",
    studentName: "Ana Vargas",
    answers: [{ questionId: "question-pendiente", optionId: "option-a" }],
    score: 100,
    submittedAt: "2026-06-12T18:00:00.000Z"
  },
  {
    id: "attempt-transformaciones-mateo",
    activityId: "verdadero-falso-transformaciones",
    studentName: "Mateo Flores",
    answers: [{ questionId: "question-transformaciones", booleanAnswer: false }],
    score: 100,
    submittedAt: "2026-06-10T19:20:00.000Z"
  }
];

export function getCourseActivities(courseId: string, activities: Activity[] = mockActivities) {
  return activities.filter((activity) => activity.courseId === courseId);
}

export function getPublishedActivities(activities: Activity[] = mockActivities) {
  return activities.filter((activity) => activity.status === "published");
}

export function findActivityById(courseId: string, activityId: string, activities: Activity[] = mockActivities) {
  return activities.find((activity) => activity.courseId === courseId && activity.id === activityId);
}

export function getActivityAttempts(activityId: string, attempts: ActivityAttempt[] = mockActivityAttempts) {
  return attempts.filter((attempt) => attempt.activityId === activityId);
}

export function getCurrentStudentActivityAttempt(activityId: string, attempts: ActivityAttempt[] = mockActivityAttempts) {
  return attempts.find((attempt) => attempt.activityId === activityId && attempt.studentName === currentStudentActivityIdentity.name);
}

export function getStudentActivityState(activity: Activity, attempts: ActivityAttempt[] = mockActivityAttempts): StudentActivityState {
  return getCurrentStudentActivityAttempt(activity.id, attempts) ? "completed" : "pending";
}

export function calculateActivityScore(activity: Activity, answers: ActivityAnswer[]) {
  if (activity.type !== "quiz" && activity.type !== "true_false") {
    return undefined;
  }

  const gradableQuestions = activity.questions.filter(
    (question) => question.correctOptionId !== undefined || question.correctBoolean !== undefined
  );

  if (!gradableQuestions.length) {
    return undefined;
  }

  const correctCount = gradableQuestions.reduce((count, question) => {
    const answer = answers.find((currentAnswer) => currentAnswer.questionId === question.id);
    const isCorrect =
      question.correctOptionId !== undefined
        ? answer?.optionId === question.correctOptionId
        : answer?.booleanAnswer === question.correctBoolean;

    return isCorrect ? count + 1 : count;
  }, 0);

  return Math.round((correctCount / gradableQuestions.length) * 100);
}

export function getAverageActivityScore(activity: Activity, attempts: ActivityAttempt[]) {
  const scoredAttempts = attempts.filter((attempt) => attempt.score !== undefined);

  if ((activity.type !== "quiz" && activity.type !== "true_false") || !scoredAttempts.length) {
    return undefined;
  }

  const total = scoredAttempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0);
  return Math.round(total / scoredAttempts.length);
}

export function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
