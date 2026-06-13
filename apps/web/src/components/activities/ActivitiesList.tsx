import type { Activity, StudentActivityState } from "../../lib/mock/activities";
import { ActivityCard } from "./ActivityCard";

type ActivitiesListProps = {
  activities: Activity[];
  emptyLabel: string;
  getCourseName: (courseId: string) => string;
  getHref: (activity: Activity) => string;
  getResponsesCount?: (activityId: string) => number;
  getStudentState?: (activity: Activity) => StudentActivityState;
  variant: "teacher" | "student";
};

export function ActivitiesList({
  activities,
  emptyLabel,
  getCourseName,
  getHref,
  getResponsesCount,
  getStudentState,
  variant
}: ActivitiesListProps) {
  if (!activities.length) {
    return (
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
        <p className="m-0 text-base font-medium text-neutral-darkGray">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {activities.map((activity) => (
        <ActivityCard
          actionLabel={variant === "student" && getStudentState?.(activity) === "completed" ? "Ver resultado" : variant === "student" ? "Responder" : "Ver actividad"}
          activity={activity}
          courseName={getCourseName(activity.courseId)}
          href={getHref(activity)}
          key={`${activity.courseId}-${activity.id}`}
          responsesCount={getResponsesCount?.(activity.id)}
          studentState={getStudentState?.(activity)}
          variant={variant}
        />
      ))}
    </section>
  );
}
