"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import { DashboardCard } from "../app/DashboardCard";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import {
  exportCourseAttendanceToExcel,
  formatAttendanceDate,
  getCourseAttendanceSummaryAsync,
  getInitialAttendanceSessionsByCourseId,
  getInitialCourseAttendanceSummary,
  getSessionAttendanceSummaryAsync,
  getAttendanceSessionsByCourseIdAsync,
  type AttendanceSession,
  type AttendanceStatusCount,
  type CourseAttendanceSummary
} from "../../lib/repositories/attendanceRepository";
import { isFirebaseDataSource } from "../../lib/config/dataSource";
import { getCourseByIdAsync, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";

type TeacherAttendanceOverviewProps = {
  courseId: string;
};

function formatPercentage(value: number) {
  return `${value}%`;
}

function createEmptyCourseSummary(): CourseAttendanceSummary {
  return {
    absent: 0,
    averageAttendance: 0,
    excused: 0,
    late: 0,
    present: 0,
    totalRecords: 0,
    totalSessions: 0
  };
}

export function TeacherAttendanceOverview({ courseId }: TeacherAttendanceOverviewProps) {
  const [course, setCourse] = useState<Course | undefined>(() => (isFirebaseDataSource() ? undefined : getInitialCourseById(courseId, "teacher")));
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => (isFirebaseDataSource() ? [] : getInitialAttendanceSessionsByCourseId(courseId)));
  const [summary, setSummary] = useState<CourseAttendanceSummary>(() =>
    isFirebaseDataSource() ? createEmptyCourseSummary() : getInitialCourseAttendanceSummary(courseId)
  );
  const [sessionSummaries, setSessionSummaries] = useState<Record<string, AttendanceStatusCount>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportError, setExportError] = useState("");
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(!isFirebaseDataSource());
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getCourseByIdAsync(courseId, "teacher"),
      getAttendanceSessionsByCourseIdAsync(courseId),
      getCourseAttendanceSummaryAsync(courseId)
    ])
      .then(async ([nextCourse, nextSessions, nextSummary]) => {
        const nextSessionSummaries = Object.fromEntries(
          await Promise.all(
            nextSessions.map(async (session) => [session.id, await getSessionAttendanceSummaryAsync(session.id)] as const)
          )
        );

        if (isActive) {
          setCourse(nextCourse);
          setSessions(nextSessions);
          setSummary(nextSummary);
          setSessionSummaries(nextSessionSummaries);
          setLoadError("");
        }
      })
      .catch(() => {
        if (isActive) {
          setCourse(undefined);
          setLoadError("No se pudo cargar la asistencia.");
        }
      })
      .finally(() => {
        if (isActive) {
          setHasLoadedStoredData(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [courseId]);

  async function handleExport() {
    setIsExporting(true);
    setExportMessage("");
    setExportError("");

    try {
      const result = await exportCourseAttendanceToExcel(courseId);
      setExportMessage(`Archivo generado: ${result.fileName}`);
    } catch {
      setExportError("No se pudo exportar el reporte.");
    } finally {
      setIsExporting(false);
    }
  }

  if (!course && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/courses"
        role="teacher"
        title="Cargando asistencia"
        subtitle="Estamos preparando el registro del curso."
        primaryAction={
          <Link href={`/teacher/courses/${courseId}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black">
            Volver al curso
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">Cargando información...</div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell
        activeHref="/teacher/courses"
        role="teacher"
        title={loadError ? "Error al cargar asistencia" : "Curso no encontrado"}
        subtitle={loadError || "No pudimos encontrar el curso solicitado."}
        primaryAction={
          <Link href="/teacher/courses" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white">
            Volver a cursos
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">Revisa la lista de cursos para continuar.</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/teacher/courses"
      role="teacher"
      title="Asistencia"
      subtitle={`${course.name} · Registro y seguimiento de clases`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Sesiones" value={String(summary.totalSessions)} helper="Clases registradas" />
        <DashboardCard label="Asistencia promedio" value={formatPercentage(summary.averageAttendance)} helper="Incluye tardanzas y justificadas" />
        <DashboardCard label="Presentes" value={String(summary.present)} helper="Registros marcados presente" />
        <DashboardCard label="Ausencias" value={String(summary.absent)} helper="Registros ausentes" />
      </section>

      <section className="mt-8 flex flex-col gap-3 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="m-0 text-xl font-extrabold text-neutral-black">Historial de asistencia</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">Registra una sesión nueva o exporta el reporte completo del curso.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/teacher/courses/${courseId}/attendance/new`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            Registrar asistencia
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-5 text-sm font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isExporting}
            onClick={handleExport}
          >
            {isExporting ? "Preparando reporte..." : "Exportar Excel"}
          </button>
        </div>
      </section>

      {exportMessage ? <p className="m-0 mt-3 text-sm font-semibold text-brand-green">{exportMessage}</p> : null}
      {exportError ? <p className="m-0 mt-3 text-sm font-semibold text-[#E5484D]">{exportError}</p> : null}

      <section className="mt-5 overflow-hidden rounded-3xl border border-neutral-lightGray bg-neutral-white">
        {sessions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-lightGray bg-neutral-offWhite text-sm font-bold text-neutral-black">
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Sesión</th>
                  <th className="px-5 py-4">Presente</th>
                  <th className="px-5 py-4">Ausente</th>
                  <th className="px-5 py-4">Tarde</th>
                  <th className="px-5 py-4">Justificado</th>
                  <th className="px-5 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const counts = sessionSummaries[session.id] ?? { absent: 0, excused: 0, late: 0, present: 0 };

                  return (
                    <tr className="border-b border-neutral-lightGray last:border-b-0" key={session.id}>
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-black">{formatAttendanceDate(session.date)}</td>
                      <td className="px-5 py-4">
                        <p className="m-0 text-sm font-bold text-neutral-black">{session.title}</p>
                        <p className="m-0 mt-1 text-xs font-medium text-neutral-darkGray">Creado por {session.createdBy}</p>
                      </td>
                      <td className="px-5 py-4"><AttendanceStatusBadge status="present" /> <span className="ml-2 text-sm font-bold text-neutral-black">{counts.present}</span></td>
                      <td className="px-5 py-4"><AttendanceStatusBadge status="absent" /> <span className="ml-2 text-sm font-bold text-neutral-black">{counts.absent}</span></td>
                      <td className="px-5 py-4"><AttendanceStatusBadge status="late" /> <span className="ml-2 text-sm font-bold text-neutral-black">{counts.late}</span></td>
                      <td className="px-5 py-4"><AttendanceStatusBadge status="excused" /> <span className="ml-2 text-sm font-bold text-neutral-black">{counts.excused}</span></td>
                      <td className="px-5 py-4 text-right">
                        <Link className="text-sm font-bold text-brand-green underline-offset-4 hover:underline" href={`/teacher/courses/${courseId}/attendance/${session.id}`}>
                          Abrir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="m-0 text-lg font-extrabold text-neutral-black">Aún no hay sesiones registradas.</h3>
            <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">Crea la primera sesión para empezar a medir la asistencia del curso.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
