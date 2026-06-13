import Link from "next/link";
import {
  activityStatusLabels,
  activityTypeLabels,
  studentActivityStateLabels,
  type Activity,
  type StudentActivityState
} from "../../lib/mock/activities";

type ActivityCardProps = {
  actionLabel: string;
  activity: Activity;
  courseName: string;
  href: string;
  responsesCount?: number;
  studentState?: StudentActivityState;
  variant: "teacher" | "student";
};

function getTeacherStatusClassName(status: Activity["status"]) {
  if (status === "published") {
    return "border-brand-green bg-brand-greenLight text-neutral-black";
  }

  return "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";
}

function getStudentStateClassName(state: StudentActivityState) {
  if (state === "completed") {
    return "border-brand-green bg-brand-greenLight text-neutral-black";
  }

  return "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";
}

export function ActivityCard({
  actionLabel,
  activity,
  courseName,
  href,
  responsesCount = 0,
  studentState,
  variant
}: ActivityCardProps) {
  const badge =
    variant === "teacher"
      ? {
          className: getTeacherStatusClassName(activity.status),
          label: activityStatusLabels[activity.status]
        }
      : {
          className: getStudentStateClassName(studentState ?? "pending"),
          label: studentActivityStateLabels[studentState ?? "pending"]
        };

  return (
    <article className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-sm font-semibold text-brand-green">{courseName}</p>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>{badge.label}</span>
        </div>
        <h2 className="m-0 mt-2 text-2xl font-extrabold leading-tight text-neutral-black">{activity.title}</h2>
        <p className="m-0 mt-2 text-sm font-medium leading-6 text-neutral-darkGray">{activity.description}</p>
      </div>

      <div className="grid gap-2 text-sm font-semibold text-neutral-black">
        <span>{activityTypeLabels[activity.type]}</span>
        {variant === "teacher" ? <span>{responsesCount} respuestas</span> : null}
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
