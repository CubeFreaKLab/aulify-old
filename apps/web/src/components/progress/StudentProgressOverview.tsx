"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInitialStudentProgressDataset,
  getStudentProgress,
  getStudentProgressDataset,
  getStudentProgressDatasetAsync,
  type ProgressDataset
} from "../../lib/repositories/progressRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { emptyProgressDataset } from "../../lib/progress";
import { CourseProgressCard } from "./CourseProgressCard";
import { PendingProgressItem } from "./PendingProgressItem";
import { ProgressSummaryCard } from "./ProgressSummaryCard";
import { RecentProgressItem } from "./RecentProgressItem";

export function StudentProgressOverview() {
  const [dataset, setDataset] = useState<ProgressDataset>(() =>
    isFirebaseDataSource() ? emptyProgressDataset : getInitialStudentProgressDataset()
  );
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    if (!isFirebaseDataSource()) {
      setDataset(getStudentProgressDataset());
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    getStudentProgressDatasetAsync()
      .then((nextDataset) => {
        if (isActive) {
          setDataset(nextDataset);
          setError("");
        }
      })
      .catch(() => {
        if (isActive) {
          setError("No se pudo cargar el seguimiento académico.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const { courseTracking, pendingItems, recentProgress, summary } = useMemo(() => getStudentProgress(dataset), [dataset]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-sm font-semibold text-neutral-darkGray">
        Cargando seguimiento...
        <span className="mt-2 block font-medium">Calculando indicadores...</span>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-sm font-semibold text-neutral-darkGray">{error}</div>;
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Resumen de avance del estudiante">
        <ProgressSummaryCard
          helper={`${summary.taskCompletionRate}% de tareas publicadas`}
          label="Tareas entregadas"
          value={`${summary.tasksSubmitted}/${summary.publishedTasks}`}
        />
        <ProgressSummaryCard
          helper={`${summary.activityCompletionRate}% de actividades publicadas`}
          label="Actividades completadas"
          value={`${summary.activitiesCompleted}/${summary.publishedActivities}`}
        />
        <ProgressSummaryCard helper="Presentes, tardanzas y justificadas" label="Mi asistencia" value={`${summary.attendancePercentage}%`} />
        <ProgressSummaryCard helper="Promedio con puntajes disponibles" label="Rendimiento" value={summary.averagePerformance === undefined ? "Sin datos" : `${summary.averagePerformance}%`} />
        <ProgressSummaryCard helper="Solo tareas y actividades" label="Avance académico" value={`${summary.academicAdvancement}%`} />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Avance por curso</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {courseTracking.length ? (
            courseTracking.map((course) => (
              <CourseProgressCard
                detailItems={[
                  `${course.pendingTasks} tareas pendientes`,
                  `${course.pendingActivities} actividades pendientes`,
                  `Asistencia ${course.attendancePercentage}%`
                ]}
                key={course.courseId}
                progress={course.academicAdvancement}
                title={course.name}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 text-sm font-medium text-neutral-darkGray">
              Sin datos suficientes todavía.
            </div>
          )}
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
