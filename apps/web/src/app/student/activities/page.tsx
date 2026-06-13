import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { StudentActivitiesOverview } from "../../../components/activities/StudentActivitiesOverview";

export default function StudentActivitiesPage() {
  return (
    <AppShell
      activeHref="/student/activities"
      role="student"
      title="Actividades"
      subtitle="Responde actividades interactivas de tus cursos."
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <StudentActivitiesOverview />
    </AppShell>
  );
}
