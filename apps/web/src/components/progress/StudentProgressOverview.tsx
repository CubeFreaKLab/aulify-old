"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInitialStudentProgressDataset,
  getStudentProgress,
  getStudentProgressDataset,
  type ProgressDataset
} from "../../lib/repositories/progressRepository";
import { CourseProgressCard } from "./CourseProgressCard";
import { PendingProgressItem } from "./PendingProgressItem";
import { ProgressSummaryCard } from "./ProgressSummaryCard";
import { RecentProgressItem } from "./RecentProgressItem";

export function StudentProgressOverview() {
  const [dataset, setDataset] = useState<ProgressDataset>(getInitialStudentProgressDataset);

  useEffect(() => {
    setDataset(getStudentProgressDataset());
  }, []);

  const { courseProgress, pendingItems, recentProgress, summary } = useMemo(() => getStudentProgress(dataset), [dataset]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de progreso del estudiante">
        <ProgressSummaryCard helper="Cursos disponibles" label="Cursos inscritos" value={String(summary.coursesEnrolled)} />
        <ProgressSummaryCard helper="Entregas registradas" label="Tareas entregadas" value={String(summary.tasksSubmitted)} />
        <ProgressSummaryCard helper="Respuestas enviadas" label="Actividades completadas" value={String(summary.activitiesCompleted)} />
        <ProgressSummaryCard helper="Promedio de avance" label="Progreso general" value={`${summary.generalProgress}%`} />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Progreso por curso</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {courseProgress.map((course) => (
            <CourseProgressCard
              detailItems={[
                `${course.pendingTasks} tareas pendientes`,
                `${course.completedActivities} actividades completas`,
                `${course.notesCount} notas publicadas`
              ]}
              key={course.courseId}
              progress={course.progress}
              title={course.name}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Pendientes</h2>
        <div className="grid gap-3 xl:grid-cols-2">
          {pendingItems.length ? (
            pendingItems.map((item) => <PendingProgressItem item={item} key={item.id} />)
          ) : (
            <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 text-sm font-medium text-neutral-darkGray">
              No tienes tareas ni actividades pendientes.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Últimos avances</h2>
        <div className="grid gap-3">
          {recentProgress.length ? (
            recentProgress.map((item) => <RecentProgressItem item={item} key={item.id} />)
          ) : (
            <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 text-sm font-medium text-neutral-darkGray">
              Aún no tienes entregas o respuestas registradas.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
