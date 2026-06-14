"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../app/AppShell";
import { DashboardCard } from "../app/DashboardCard";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import {
  formatAttendanceDate,
  getAttendanceRecordsBySessionId,
  getAttendanceSessionsByCourseId,
  getInitialAttendanceSessionsByCourseId,
  getStudentAttendanceSummary,
  getStudentForAttendance,
  type AttendanceSession,
  type AttendanceStudent,
  type StudentAttendanceSummary
} from "../../lib/repositories/attendanceRepository";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { useMockSession } from "../../lib/useMockSession";

type StudentAttendanceOverviewProps = {
  courseId: string;
};

function formatPercentage(value: number) {
  return `${value}%`;
}

export function StudentAttendanceOverview({ courseId }: StudentAttendanceOverviewProps) {
  const { session } = useMockSession();
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "student"));
  const [student, setStudent] = useState<AttendanceStudent | undefined>(() => getStudentForAttendance(courseId, session?.email));
  const [summary, setSummary] = useState<StudentAttendanceSummary | undefined>(() => {
    const initialStudent = getStudentForAttendance(courseId, session?.email);
    return initialStudent ? getStudentAttendanceSummary(courseId, initialStudent.id) : undefined;
  });
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => getInitialAttendanceSessionsByCourseId(courseId));
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const nextStudent = getStudentForAttendance(courseId, session?.email);

    setCourse(getCourseById(courseId, "student"));
    setStudent(nextStudent);
    setSummary(nextStudent ? getStudentAttendanceSummary(courseId, nextStudent.id) : undefined);
    setSessions(getAttendanceSessionsByCourseId(courseId));
    setHasLoadedStoredData(true);
  }, [courseId, session?.email]);

  const sessionRows = useMemo(
    () =>
      sessions.map((attendanceSession) => {
        const record = student
          ? getAttendanceRecordsBySessionId(attendanceSession.id).find((item) => item.studentId === student.id)
          : undefined;

        return { record, session: attendanceSession };
      }),
    [sessions, student]
  );

  if (!course && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/student/courses"
        role="student"
        title="Cargando asistencia"
        subtitle="Estamos preparando tu resumen."
        primaryAction={
          <Link href={`/student/courses/${courseId}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black">
            Volver al curso
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">Cargando información...</div>
      </AppShell>
    );
  }

  if (!course || !student || !summary) {
    return (
      <AppShell
        activeHref="/student/courses"
        role="student"
        title="Asistencia no disponible"
        subtitle="No encontramos información de asistencia para este curso."
        primaryAction={
          <Link href={`/student/courses/${courseId}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white">
            Volver al curso
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">Revisa tus cursos inscritos para continuar.</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/student/courses"
      role="student"
      title="Mi asistencia"
      subtitle={`${course.name} · ${student.name}`}
      primaryAction={
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Volver al curso
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard label="Asistencia" value={formatPercentage(summary.attendancePercentage)} helper="Promedio general" />
        <DashboardCard label="Presentes" value={String(summary.present)} helper="Clases asistidas" />
        <DashboardCard label="Ausencias" value={String(summary.absent)} helper="Clases no asistidas" />
        <DashboardCard label="Tardanzas" value={String(summary.late)} helper="Llegadas tarde" />
        <DashboardCard label="Justificadas" value={String(summary.excused)} helper="Ausencias justificadas" />
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-neutral-lightGray bg-neutral-white">
        <div className="border-b border-neutral-lightGray p-5">
          <h2 className="m-0 text-xl font-extrabold text-neutral-black">Historial</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">Consulta el estado registrado para cada sesión del curso.</p>
        </div>
        {sessionRows.length ? (
          <div className="grid divide-y divide-neutral-lightGray">
            {sessionRows.map(({ record, session: attendanceSession }) => (
              <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center" key={attendanceSession.id}>
                <div>
                  <p className="m-0 text-base font-extrabold text-neutral-black">{attendanceSession.title}</p>
                  <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">{formatAttendanceDate(attendanceSession.date)}</p>
                  {record?.note ? <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">{record.note}</p> : null}
                </div>
                {record ? <AttendanceStatusBadge status={record.status} /> : <span className="text-sm font-bold text-neutral-darkGray">Sin registro</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <h3 className="m-0 text-lg font-extrabold text-neutral-black">Aún no hay asistencia registrada.</h3>
            <p className="m-0 mt-2 text-sm font-medium text-neutral-darkGray">Cuando tu profesor registre una sesión, aparecerá en este historial.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
