import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { StudentCoursesList } from "../../../components/courses/StudentCoursesList";

export default function StudentCoursesPage() {
  return (
    <AppShell
      activeHref="/student/courses"
      role="student"
      title="Mis cursos"
      subtitle="Accede a tus clases, materiales, tareas y actividades pendientes."
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Ver cursos
        </Link>
      }
    >
      <StudentCoursesList />
    </AppShell>
  );
}
