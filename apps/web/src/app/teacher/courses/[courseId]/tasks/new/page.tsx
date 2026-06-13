import Link from "next/link";
import { AppShell } from "../../../../../../components/app/AppShell";
import { TaskForm } from "../../../../../../components/tasks/TaskForm";
import { findCourseById } from "../../../../../../lib/mock/courses";

type NewTeacherTaskPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function NewTeacherTaskPage({ params }: NewTeacherTaskPageProps) {
  const { courseId } = await params;
  const course = findCourseById(courseId);
  const courseName = course?.name ?? "Curso seleccionado";

  return (
    <AppShell
      activeHref="/teacher/tasks"
      role="teacher"
      title="Crear tarea"
      subtitle={`Define una tarea para ${courseName}.`}
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
        <TaskForm courseId={courseId} />
      </div>
    </AppShell>
  );
}
