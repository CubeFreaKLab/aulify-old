import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { TeacherActivitiesOverview } from "../../../components/activities/TeacherActivitiesOverview";

export default function TeacherActivitiesPage() {
  return (
    <AppShell
      activeHref="/teacher/activities"
      role="teacher"
      title="Actividades"
      subtitle="Crea actividades interactivas para reforzar tus clases."
      primaryAction={
        <Link
          href="/teacher/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <TeacherActivitiesOverview />
    </AppShell>
  );
}
