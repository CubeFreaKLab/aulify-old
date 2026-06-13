import Link from "next/link";
import { AppShell } from "../../../../../../components/app/AppShell";
import { ActivityForm } from "../../../../../../components/activities/ActivityForm";
import { findCourseById } from "../../../../../../lib/mock/courses";

type NewTeacherActivityPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function NewTeacherActivityPage({ params }: NewTeacherActivityPageProps) {
  const { courseId } = await params;
  const course = findCourseById(courseId);
  const courseName = course?.name ?? "Curso seleccionado";

  return (
    <AppShell
      activeHref="/teacher/activities"
      role="teacher"
      title="Crear actividad"
      subtitle={`Prepara una actividad asincrónica para ${courseName}.`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
      }
    >
      <div className="max-w-3xl">
        <ActivityForm courseId={courseId} />
      </div>
    </AppShell>
  );
}
