import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { StudentTasksOverview } from "../../../components/tasks/StudentTasksOverview";

export default function StudentTasksPage() {
  return (
    <AppShell
      activeHref="/student/tasks"
      role="student"
      title="Tareas"
      subtitle="Revisa tus tareas pendientes y entregas realizadas."
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <StudentTasksOverview />
    </AppShell>
  );
}
