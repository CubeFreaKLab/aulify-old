import Link from "next/link";
import { AppShell } from "../../../../components/app/AppShell";
import { CreateCourseForm } from "../../../../components/courses/CreateCourseForm";

export default function NewTeacherCoursePage() {
  return (
    <AppShell
      activeHref="/teacher/courses"
      role="teacher"
      title="Crear curso"
      subtitle="Define la información base para organizar contenidos, tareas y actividades."
      primaryAction={
        <Link
          href="/teacher/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
      }
    >
      <div className="max-w-3xl">
        <CreateCourseForm />
      </div>
    </AppShell>
  );
}
