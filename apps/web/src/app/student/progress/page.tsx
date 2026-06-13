import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { StudentProgressOverview } from "../../../components/progress/StudentProgressOverview";

export default function StudentProgressPage() {
  return (
    <AppShell
      activeHref="/student/progress"
      role="student"
      title="Mi progreso"
      subtitle="Revisa tu avance en cursos, tareas y actividades."
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <StudentProgressOverview />
    </AppShell>
  );
}
