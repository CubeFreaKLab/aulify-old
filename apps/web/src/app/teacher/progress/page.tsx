import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { TeacherProgressOverview } from "../../../components/progress/TeacherProgressOverview";

export default function TeacherProgressPage() {
  return (
    <AppShell
      activeHref="/teacher/progress"
      role="teacher"
      title="Seguimiento académico"
      subtitle="Analiza entregas, actividades, asistencia y alertas de tus cursos."
      primaryAction={
        <Link
          href="/teacher/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <TeacherProgressOverview />
    </AppShell>
  );
}
