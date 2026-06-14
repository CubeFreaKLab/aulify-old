"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { AppShell } from "../app/AppShell";
import {
  attendanceStatusLabels,
  getAttendanceSessionById,
  getCourseAttendanceRoster,
  getEditableAttendanceRecords,
  getInitialAttendanceSessionById,
  saveAttendanceSessionWithRecords,
  type AttendanceSession,
  type AttendanceStatus,
  type StoredAttendanceRecordInput
} from "../../lib/repositories/attendanceRepository";
import { getCourseById, getInitialCourseById, type Course } from "../../lib/repositories/courseRepository";
import { useMockSession } from "../../lib/useMockSession";

type AttendanceSessionFormProps = {
  courseId: string;
  sessionId: string;
};

type AttendanceFormErrors = {
  date: string;
  title: string;
};

type AttendanceRecordDraft = StoredAttendanceRecordInput;

const statusOptions: AttendanceStatus[] = ["present", "absent", "late", "excused"];

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

function createDefaultDraftRecords(courseId: string): AttendanceRecordDraft[] {
  return getCourseAttendanceRoster(courseId).map((student) => ({
    courseId,
    note: "",
    sessionId: "",
    status: "present",
    studentId: student.id,
    studentName: student.name
  }));
}

function createDraftRecords(session: AttendanceSession | undefined, courseId: string): AttendanceRecordDraft[] {
  return session ? getEditableAttendanceRecords(session) : createDefaultDraftRecords(courseId);
}

export function AttendanceSessionForm({ courseId, sessionId }: AttendanceSessionFormProps) {
  const isNewSession = sessionId === "new";
  const router = useRouter();
  const { session: currentSession } = useMockSession();
  const [course, setCourse] = useState<Course | undefined>(() => getInitialCourseById(courseId, "teacher"));
  const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | undefined>(() =>
    isNewSession ? undefined : getInitialAttendanceSessionById(sessionId)
  );
  const [title, setTitle] = useState(() => (isNewSession ? "Asistencia de clase" : getInitialAttendanceSessionById(sessionId)?.title ?? ""));
  const [date, setDate] = useState(() => (isNewSession ? getTodayValue() : getInitialAttendanceSessionById(sessionId)?.date ?? getTodayValue()));
  const [records, setRecords] = useState<AttendanceRecordDraft[]>(() => createDraftRecords(isNewSession ? undefined : getInitialAttendanceSessionById(sessionId), courseId));
  const [errors, setErrors] = useState<AttendanceFormErrors>({ date: "", title: "" });
  const [hasLoadedStoredData, setHasLoadedStoredData] = useState(false);

  useEffect(() => {
    const nextCourse = getCourseById(courseId, "teacher");
    const nextSession = isNewSession ? undefined : getAttendanceSessionById(sessionId);

    setCourse(nextCourse);
    setAttendanceSession(nextSession);

    if (nextSession) {
      setTitle(nextSession.title);
      setDate(nextSession.date);
      setRecords(createDraftRecords(nextSession, courseId));
    } else if (isNewSession) {
      setRecords(createDefaultDraftRecords(courseId));
    }

    setHasLoadedStoredData(true);
  }, [courseId, isNewSession, sessionId]);

  function updateRecord(studentId: string, updates: Partial<AttendanceRecordDraft>) {
    setRecords((currentRecords) =>
      currentRecords.map((record) => (record.studentId === studentId ? { ...record, ...updates } : record))
    );
  }

  function validateForm() {
    return {
      date: date ? "" : "Selecciona la fecha de la sesión.",
      title: title.trim() ? "" : "Ingresa el título de la sesión."
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.date || nextErrors.title) {
      return;
    }

    saveAttendanceSessionWithRecords(
      courseId,
      {
        createdBy: attendanceSession?.createdBy ?? currentSession?.name ?? "Profesor Demo",
        date,
        title
      },
      records.map((record) => ({
        id: record.id,
        note: record.note,
        status: record.status,
        studentId: record.studentId,
        studentName: record.studentName
      })),
      attendanceSession
    );

    router.push(`/teacher/courses/${courseId}/attendance`);
  }

  if (!course && !hasLoadedStoredData) {
    return (
      <AppShell
        activeHref="/teacher/courses"
        role="teacher"
        title="Cargando asistencia"
        subtitle="Estamos preparando el registro."
        primaryAction={
          <Link href={`/teacher/courses/${courseId}/attendance`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black">
            Volver
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">Cargando información...</div>
      </AppShell>
    );
  }

  if (!course || (!isNewSession && !attendanceSession)) {
    return (
      <AppShell
        activeHref="/teacher/courses"
        role="teacher"
        title="Sesión no encontrada"
        subtitle="No pudimos encontrar el registro solicitado."
        primaryAction={
          <Link href={`/teacher/courses/${courseId}/attendance`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white">
            Volver a asistencia
          </Link>
        }
      >
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-base font-medium text-neutral-darkGray">Revisa el historial de asistencia para continuar.</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeHref="/teacher/courses"
      role="teacher"
      title={isNewSession ? "Registrar asistencia" : "Editar asistencia"}
      subtitle={`${course.name} · ${date ? new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)) : "Nueva sesión"}`}
      primaryAction={
        <Link
          href={`/teacher/courses/${courseId}/attendance`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
      }
    >
      <form className="grid gap-6" noValidate onSubmit={handleSubmit}>
        <section className="grid gap-4 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:grid-cols-[1.3fr_0.7fr]">
          <div>
            <label className="text-sm font-bold text-neutral-black" htmlFor="attendance-title">
              Título de la sesión *
            </label>
            <input
              id="attendance-title"
              className="mt-2 min-h-12 w-full rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-semibold text-neutral-black outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errors.title) {
                  setErrors((currentErrors) => ({ ...currentErrors, title: event.target.value.trim() ? "" : currentErrors.title }));
                }
              }}
            />
            {errors.title ? <p className="m-0 mt-2 text-sm font-semibold text-[#E5484D]">{errors.title}</p> : null}
          </div>
          <div>
            <label className="text-sm font-bold text-neutral-black" htmlFor="attendance-date">
              Fecha *
            </label>
            <input
              id="attendance-date"
              className="mt-2 min-h-12 w-full rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-semibold text-neutral-black outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                if (errors.date) {
                  setErrors((currentErrors) => ({ ...currentErrors, date: event.target.value ? "" : currentErrors.date }));
                }
              }}
            />
            {errors.date ? <p className="m-0 mt-2 text-sm font-semibold text-[#E5484D]">{errors.date}</p> : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-neutral-lightGray bg-neutral-white">
          <div className="border-b border-neutral-lightGray p-5">
            <h2 className="m-0 text-xl font-extrabold text-neutral-black">Estudiantes</h2>
            <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">Selecciona el estado de asistencia y agrega una nota cuando sea necesario.</p>
          </div>
          <div className="grid divide-y divide-neutral-lightGray">
            {records.map((record) => (
              <div className="grid gap-3 p-5 lg:grid-cols-[1fr_220px_1fr] lg:items-center" key={record.studentId}>
                <div>
                  <p className="m-0 text-base font-extrabold text-neutral-black">{record.studentName}</p>
                  <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">{record.studentId}</p>
                </div>
                <select
                  className="min-h-11 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-sm font-bold text-neutral-black outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                  value={record.status}
                  onChange={(event) => updateRecord(record.studentId, { status: event.target.value as AttendanceStatus })}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {attendanceStatusLabels[status]}
                    </option>
                  ))}
                </select>
                <input
                  className="min-h-11 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-sm font-semibold text-neutral-black outline-none transition placeholder:text-neutral-darkGray focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"
                  placeholder="Nota opcional"
                  value={record.note ?? ""}
                  onChange={(event) => updateRecord(record.studentId, { note: event.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-full border border-neutral-lightGray bg-neutral-white/95 p-2 shadow-card backdrop-blur sm:flex-row sm:justify-end">
          <Link
            href={`/teacher/courses/${courseId}/attendance`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
          >
            Guardar asistencia
          </button>
        </div>
      </form>
    </AppShell>
  );
}
