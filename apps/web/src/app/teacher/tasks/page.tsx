import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { TeacherTasksOverview } from "../../../components/tasks/TeacherTasksOverview";

export default function TeacherTasksPage() {
  return (
    <AppShell
      activeHref="/teacher/tasks"
      role="teacher"
      title="Tareas"
      subtitle="Gestiona las tareas asignadas en tus cursos."
      primaryAction={
        <Link
          href="/teacher/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <TeacherTasksOverview />
    </AppShell>
  );
}
