import Link from "next/link";
import { AppShell } from "../../../../components/app/AppShell";
import { DashboardCard } from "../../../../components/app/DashboardCard";
import { CoursePreviewList } from "../../../../components/courses/CoursePreviewList";
import { findCourseById, studentCourses } from "../../../../lib/mock/courses";

type StudentCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function StudentCourseDetailPage({ params }: StudentCourseDetailPageProps) {
  const { courseId } = await params;
  const course = findCourseById(courseId, studentCourses);

  if (!course) {
    return (
      <AppShell
        activeHref="/student/courses"
        role="student"
        title="Curso no encontrado"
        subtitle="No pudimos encontrar el curso solicitado."
        primaryAction={
          <Link
            href="/student/courses"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white"
          >
            Volver a cursos
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">
          Revisa tus cursos inscritos para continuar.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/student/courses"
      role="student"
      title={course.name}
      subtitle={`${course.teacherName} · ${course.description}`}
      primaryAction={
        <Link
          href="/student/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver a cursos
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Progreso" value={course.progress.label} helper="Avance del curso" />
        <DashboardCard label="Tareas pendientes" value={String(course.pendingTasksCount)} helper="Por completar" />
        <DashboardCard label="Actividades" value={String(course.pendingActivitiesCount)} helper="Asignadas" />
        <DashboardCard label="Contenidos" value={String(course.contentsCount)} helper="Disponibles" />
      </section>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <CoursePreviewList emptyLabel="Aún no hay contenidos recientes." items={course.contents} title="Contenidos recientes" />
        <CoursePreviewList emptyLabel="No tienes tareas pendientes." items={course.tasks} title="Tareas pendientes" />
        <CoursePreviewList emptyLabel="No tienes actividades por completar." items={course.activities} title="Actividades por completar" />
      </div>
    </AppShell>
  );
}
