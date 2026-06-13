"use client";

import { useEffect, useMemo, useState } from "react";
import { readStoredActivityAttempts, readStoredTeacherActivities } from "../../lib/activityStorage";
import { readStoredTeacherCourses } from "../../lib/courseStorage";
import { mockActivities, mockActivityAttempts } from "../../lib/mock/activities";
import { teacherCourses } from "../../lib/mock/courses";
import { mockNotes } from "../../lib/mock/notes";
import { mockTaskSubmissions, mockTasks } from "../../lib/mock/tasks";
import { readStoredTeacherNotes } from "../../lib/noteStorage";
import {
  getTeacherCourseProgress,
  getTeacherProgressSummary,
  getTeacherRecentProgress,
  type ProgressDataset
} from "../../lib/progress";
import { readStoredTaskSubmissions, readStoredTeacherTasks } from "../../lib/taskStorage";
import { CourseProgressCard } from "./CourseProgressCard";
import { ProgressBar } from "./ProgressBar";
import { ProgressSummaryCard } from "./ProgressSummaryCard";
import { RecentProgressItem } from "./RecentProgressItem";

const initialTeacherDataset: ProgressDataset = {
  activities: mockActivities,
  activityAttempts: mockActivityAttempts,
  courses: teacherCourses,
  notes: mockNotes,
  taskSubmissions: mockTaskSubmissions,
  tasks: mockTasks
};

type IndicatorCardProps = {
  helper: string;
  label: string;
  value: number;
};

function IndicatorCard({ helper, label, value }: IndicatorCardProps) {
  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-base font-bold text-neutral-black">{label}</h3>
          <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">{helper}</p>
        </div>
        <span className="shrink-0 text-2xl font-extrabold text-brand-green">{value}%</span>
      </div>
      <div className="mt-4">
        <ProgressBar value={value} />
      </div>
    </article>
  );
}

export function TeacherProgressOverview() {
  const [dataset, setDataset] = useState<ProgressDataset>(initialTeacherDataset);

  useEffect(() => {
    setDataset({
      activities: [...readStoredTeacherActivities(), ...mockActivities],
      activityAttempts: [...readStoredActivityAttempts(), ...mockActivityAttempts],
      courses: [...readStoredTeacherCourses(), ...teacherCourses],
      notes: [...readStoredTeacherNotes(), ...mockNotes],
      taskSubmissions: [...readStoredTaskSubmissions(), ...mockTaskSubmissions],
      tasks: [...readStoredTeacherTasks(), ...mockTasks]
    });
  }, []);

  const summary = useMemo(() => getTeacherProgressSummary(dataset), [dataset]);
  const courseProgress = useMemo(() => getTeacherCourseProgress(dataset), [dataset]);
  const recentProgress = useMemo(() => getTeacherRecentProgress(dataset), [dataset]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de progreso del profesor">
        <ProgressSummaryCard helper="Cursos en seguimiento" label="Cursos activos" value={String(summary.activeCourses)} />
        <ProgressSummaryCard helper="Asignaciones visibles" label="Tareas publicadas" value={String(summary.publishedTasks)} />
        <ProgressSummaryCard helper="Tareas entregadas" label="Entregas recibidas" value={String(summary.submissionsReceived)} />
        <ProgressSummaryCard helper="Intentos registrados" label="Actividades completadas" value={String(summary.activitiesCompleted)} />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Resumen por curso</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {courseProgress.map((course) => (
            <CourseProgressCard
              detailItems={[
                `${course.studentsCount} estudiantes`,
                `${course.groupsCount} grupos`,
                `${course.taskCount} tareas`,
                `${course.activityCount} actividades`
              ]}
              key={course.courseId}
              progress={course.progress}
              title={course.name}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Actividad académica</h2>
        <div className="grid gap-3">
          {recentProgress.length ? (
            recentProgress.map((item) => <RecentProgressItem item={item} key={item.id} />)
          ) : (
            <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 text-sm font-medium text-neutral-darkGray">
              Aún no hay entregas ni respuestas registradas.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Indicadores</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <IndicatorCard helper="Entregas y respuestas frente a publicaciones" label="Tasa de finalización" value={summary.completionRate} />
          <IndicatorCard
            helper={`${summary.pendingTasks} tareas sin entrega registrada`}
            label="Tareas pendientes"
            value={Math.max(0, 100 - summary.pendingTasks * 10)}
          />
          <IndicatorCard helper="Respuestas frente a actividades publicadas" label="Participación en actividades" value={summary.activityParticipation} />
        </div>
      </section>
    </div>
  );
}
