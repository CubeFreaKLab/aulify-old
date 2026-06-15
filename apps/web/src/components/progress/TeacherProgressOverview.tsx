"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInitialTeacherProgressDataset,
  getTeacherProgress,
  getTeacherProgressDataset,
  getTeacherProgressDatasetAsync,
  type ProgressDataset
} from "../../lib/repositories/progressRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { emptyProgressDataset } from "../../lib/progress";
import { CourseProgressCard } from "./CourseProgressCard";
import { ProgressBar } from "./ProgressBar";
import { ProgressSummaryCard } from "./ProgressSummaryCard";
import { RecentProgressItem } from "./RecentProgressItem";

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

function formatExpected(value: number, total: number) {
  return total ? `${value}/${total} esperadas` : "Sin datos suficientes todavía";
}

export function TeacherProgressOverview() {
  const [dataset, setDataset] = useState<ProgressDataset>(() =>
    isFirebaseDataSource() ? emptyProgressDataset : getInitialTeacherProgressDataset()
  );
  const [isLoading, setIsLoading] = useState(isFirebaseDataSource);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    if (!isFirebaseDataSource()) {
      setDataset(getTeacherProgressDataset());
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    getTeacherProgressDatasetAsync()
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

  const { courseTracking, recentProgress, riskStudents, summary } = useMemo(() => getTeacherProgress(dataset), [dataset]);

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
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Resumen de seguimiento académico">
        <ProgressSummaryCard helper="Cursos en seguimiento" label="Cursos activos" value={String(summary.activeCourses)} />
        <ProgressSummaryCard helper="Miembros activos en cursos" label="Estudiantes" value={String(summary.totalActiveStudents)} />
        <ProgressSummaryCard
          helper={formatExpected(summary.submissionsReceived, summary.expectedSubmissions)}
          label="Entregas de tareas"
          value={`${summary.taskSubmissionRate}%`}
        />
        <ProgressSummaryCard
          helper={formatExpected(summary.activityAttemptsReceived, summary.expectedActivityAttempts)}
          label="Actividades completadas"
          value={`${summary.activityParticipationRate}%`}
        />
        <ProgressSummaryCard helper="Registros de asistencia" label="Asistencia promedio" value={`${summary.averageAttendance}%`} />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Participación del curso</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {courseTracking.length ? (
            courseTracking.map((course) => (
              <CourseProgressCard
                detailItems={[
                  `${course.studentsCount} estudiantes`,
                  `Entregas ${course.taskSubmissionRate}%`,
                  `Actividades ${course.activityParticipationRate}%`,
                  `Asistencia ${course.attendanceRate}%`
                ]}
                key={course.courseId}
                progress={course.academicParticipation}
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
        <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Estudiantes con alertas</h2>
        <div className="grid gap-3 xl:grid-cols-2">
          {riskStudents.length ? (
            riskStudents.map((student) => (
              <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5" key={student.id}>
                <p className="m-0 text-sm font-semibold text-brand-green">{student.courseName}</p>
                <h3 className="m-0 mt-1 text-base font-bold leading-tight text-neutral-black">{student.studentName}</h3>
                <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">{student.detail}</p>
                <p className="m-0 mt-3 text-sm font-semibold text-neutral-darkGray">
                  {student.attendancePercentage !== undefined ? `Asistencia ${student.attendancePercentage}% · ` : ""}
                  {student.missingTasks} tareas pendientes · {student.missingActivities} actividades sin completar
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 text-sm font-medium text-neutral-darkGray">
              Sin datos suficientes todavía.
            </div>
          )}
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
          <IndicatorCard helper="Entregas frente a tareas publicadas por estudiante" label="Entregas de tareas" value={summary.taskSubmissionRate} />
          <IndicatorCard helper="Respuestas frente a actividades publicadas por estudiante" label="Participación en actividades" value={summary.activityParticipationRate} />
          <IndicatorCard helper="Presentes, tardanzas y justificadas sobre registros" label="Asistencia promedio" value={summary.averageAttendance} />
        </div>
      </section>
    </div>
  );
}
