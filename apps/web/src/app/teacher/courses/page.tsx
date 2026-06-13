import Link from "next/link";
import { AppShell } from "../../../components/app/AppShell";
import { TeacherCoursesList } from "../../../components/courses/TeacherCoursesList";

export default function TeacherCoursesPage() {
  return (
    <AppShell
      activeHref="/teacher/courses"
      role="teacher"
      title="Cursos"
      subtitle="Gestiona tus clases, contenidos, tareas y actividades."
      primaryAction={
        <Link
          href="/teacher/courses/new"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Crear curso
        </Link>
      }
    >
      <TeacherCoursesList />
    </AppShell>
  );
}
