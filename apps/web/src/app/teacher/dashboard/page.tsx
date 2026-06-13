import Link from "next/link";
import { ActivityPreviewItem } from "../../../components/app/ActivityPreviewItem";
import { AppShell } from "../../../components/app/AppShell";
import { CoursePreviewCard } from "../../../components/app/CoursePreviewCard";
import { DashboardCard } from "../../../components/app/DashboardCard";

const summaryCards = [
  { label: "Cursos activos", value: "6", helper: "2 actualizados hoy" },
  { label: "Tareas pendientes", value: "14", helper: "5 por revisar" },
  { label: "Actividades creadas", value: "28", helper: "4 esta semana" },
  { label: "Estudiantes", value: "142", helper: "En cursos activos" }
];

const recentCourses = [
  {
    title: "Matemática aplicada",
    description: "Funciones, práctica guiada y actividades de repaso para segundo semestre.",
    meta: "4 grupos",
    progressLabel: "72%"
  },
  {
    title: "Historia contemporánea",
    description: "Notas de clase, tareas de lectura y encuestas asincrónicas por unidad.",
    meta: "3 grupos",
    progressLabel: "58%"
  },
  {
    title: "Comunicación escrita",
    description: "Talleres, entregas semanales y seguimiento de avances por estudiante.",
    meta: "2 grupos",
    progressLabel: "81%"
  }
];

const recentActivity = [
  {
    label: "Nueva tarea publicada",
    title: "Ejercicios de funciones",
    detail: "Matemática aplicada · vence el viernes"
  },
  {
    label: "Nota de clase actualizada",
    title: "Guía de análisis histórico",
    detail: "Historia contemporánea · hace 2 horas"
  },
  {
    label: "Actividad interactiva creada",
    title: "Encuesta de comprensión",
    detail: "Comunicación escrita · lista para asignar"
  }
];

export default function TeacherDashboardPage() {
  return (
    <AppShell
      activeHref="/teacher/dashboard"
      role="teacher"
      title="Panel del profesor"
      subtitle="Organiza tus clases, contenidos, tareas y actividades desde un solo lugar."
      primaryAction={
        <Link
          href="/teacher/courses/new"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Crear curso
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen del profesor">
        {summaryCards.map((card) => (
          <DashboardCard helper={card.helper} key={card.label} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="mt-8 grid gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Cursos recientes</h2>
          <Link href="/teacher/courses" className="text-sm font-bold text-brand-green">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {recentCourses.map((course) => (
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
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Actividad reciente</h2>
        <div className="grid gap-3">
          {recentActivity.map((activity) => (
            <ActivityPreviewItem detail={activity.detail} key={activity.title} label={activity.label} title={activity.title} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
