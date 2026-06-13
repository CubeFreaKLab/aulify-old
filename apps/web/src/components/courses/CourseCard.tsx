import Link from "next/link";
import type { Course } from "../../lib/mock/courses";

type CourseCardProps = {
  actionLabel: string;
  course: Course;
  href: string;
  mode: "teacher" | "student";
};

export function CourseCard({ actionLabel, course, href, mode }: CourseCardProps) {
  const secondaryMetric =
    mode === "teacher"
      ? `${course.studentsCount} estudiantes · ${course.groupsCount} grupos`
      : `${course.pendingTasksCount} tareas · ${course.pendingActivitiesCount} actividades`;

  return (
    <article className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div>
        <p className="m-0 text-sm font-semibold text-brand-green">{mode === "teacher" ? course.groupLabel : course.teacherName}</p>
        <h2 className="m-0 mt-2 text-2xl font-extrabold leading-tight text-neutral-black">{course.name}</h2>
        <p className="m-0 mt-2 text-sm font-medium leading-6 text-neutral-darkGray">{course.description}</p>
      </div>

      <div className="grid gap-2 text-sm font-semibold text-neutral-black">
        <span>{secondaryMetric}</span>
        <span>
          {course.tasksCount} tareas · {course.activitiesCount} actividades
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-neutral-darkGray">{mode === "teacher" ? "Actividad" : "Progreso"}</span>
          <span className="text-brand-green">{course.progress.label}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-neutral-offWhite">
          <div className="h-2 rounded-full bg-brand-green" style={{ width: `${course.progress.value}%` }} />
        </div>
      </div>

      <Link
        href={href}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
      >
        {actionLabel}
      </Link>
    </article>
  );
}
