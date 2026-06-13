import Link from "next/link";
import { ActivityPreviewItem } from "../../../components/app/ActivityPreviewItem";
import { AppShell } from "../../../components/app/AppShell";
import { CoursePreviewCard } from "../../../components/app/CoursePreviewCard";
import { DashboardCard } from "../../../components/app/DashboardCard";
import { TaskPreviewItem } from "../../../components/app/TaskPreviewItem";

const summaryCards = [
  { label: "Cursos inscritos", value: "5", helper: "3 con actividad reciente" },
  { label: "Tareas pendientes", value: "7", helper: "2 vencen pronto" },
  { label: "Actividades por completar", value: "4", helper: "Asignadas esta semana" },
  { label: "Progreso general", value: "68%", helper: "Promedio actual" }
];

const courses = [
  {
    title: "Matemática aplicada",
    description: "Repasa funciones, ejercicios resueltos y actividades de práctica.",
    meta: "Profesor: Laura Méndez",
    progressLabel: "74%"
  },
  {
    title: "Historia contemporánea",
    description: "Lecturas, notas de clase y preguntas rápidas de cada unidad.",
    meta: "Profesor: Diego Rojas",
    progressLabel: "61%"
  },
  {
    title: "Comunicación escrita",
    description: "Talleres y entregas para mejorar tus textos académicos.",
    meta: "Profesora: Carla Pérez",
    progressLabel: "82%"
  }
];

const pendingTasks = [
  {
    title: "Resolver guía de funciones",
    course: "Matemática aplicada",
    due: "Viernes"
  },
  {
    title: "Entregar resumen de lectura",
    course: "Historia contemporánea",
    due: "Lunes"
  }
];

const pendingActivities = [
  {
    label: "Actividad por completar",
    title: "Pregunta rápida de comprensión",
    detail: "Comunicación escrita · toma 5 minutos"
  },
  {
    label: "Encuesta pendiente",
    title: "Autoevaluación de la unidad",
    detail: "Historia contemporánea · disponible hasta mañana"
  }
];

export default function StudentDashboardPage() {
  return (
    <AppShell
      activeHref="/student/dashboard"
      role="student"
      title="Panel del estudiante"
      subtitle="Revisa tus clases, tareas y actividades pendientes."
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen del estudiante">
        {summaryCards.map((card) => (
          <DashboardCard helper={card.helper} key={card.label} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="mt-8 grid gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Mis cursos</h2>
          <Link href="/student/courses" className="text-sm font-bold text-brand-green">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {courses.map((course) => (
            <CoursePreviewCard
              description={course.description}
              key={course.title}
              meta={course.meta}
              progressLabel={course.progressLabel}
              title={course.title}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Pendientes</h2>
        <div className="grid gap-3 xl:grid-cols-2">
          <div className="grid gap-3">
            {pendingTasks.map((task) => (
              <TaskPreviewItem course={task.course} due={task.due} key={task.title} title={task.title} />
            ))}
          </div>
          <div className="grid gap-3">
            {pendingActivities.map((activity) => (
              <ActivityPreviewItem detail={activity.detail} key={activity.title} label={activity.label} title={activity.title} />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
