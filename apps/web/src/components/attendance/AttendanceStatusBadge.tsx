import { attendanceStatusLabels, type AttendanceStatus } from "../../lib/repositories/attendanceRepository";

type AttendanceStatusBadgeProps = {
  status: AttendanceStatus;
};

const statusClassNames: Record<AttendanceStatus, string> = {
  absent: "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray",
  excused: "border-neutral-lightGray bg-neutral-white text-neutral-darkGray",
  late: "border-brand-green bg-neutral-white text-brand-green",
  present: "border-brand-green bg-brand-greenLight text-neutral-black"
};

export function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClassNames[status]}`}>{attendanceStatusLabels[status]}</span>;
}
