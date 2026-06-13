import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { StudentNotesOverview } from "../../../components/notes/StudentNotesOverview";

export default function StudentNotesPage() {
  return (
    <AppShell
      activeHref="/student/notes"
      role="student"
      title="Notas"
      subtitle="Revisa los contenidos publicados en tus cursos."
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <StudentNotesOverview />
    </AppShell>
  );
}
