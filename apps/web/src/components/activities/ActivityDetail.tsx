import type { ReactNode } from "react";
import { activityStatusLabels, activityTypeLabels, type Activity } from "../../lib/mock/activities";

type ActivityDetailProps = {
  activity: Activity;
  courseName: string;
  teacherActions?: ReactNode;
};

function getStatusClassName(status: Activity["status"]) {
  if (status === "published") {
    return "border-brand-green bg-brand-greenLight text-neutral-black";
  }

  return "border-neutral-lightGray bg-neutral-offWhite text-neutral-darkGray";
}

export function ActivityDetail({ activity, courseName, teacherActions }: ActivityDetailProps) {
  return (
    <article className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-neutral-lightGray pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="m-0 text-sm font-semibold text-brand-green">{courseName}</p>
          <h2 className="m-0 mt-2 text-3xl font-extrabold leading-tight text-neutral-black">{activity.title}</h2>
          <p className="m-0 mt-3 max-w-3xl text-base font-medium leading-7 text-neutral-darkGray">{activity.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="rounded-full border border-neutral-lightGray bg-neutral-offWhite px-3 py-1 text-xs font-bold text-neutral-darkGray">
            {activityTypeLabels[activity.type]}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClassName(activity.status)}`}>
            {activityStatusLabels[activity.status]}
          </span>
          {teacherActions}
        </div>
      </div>

      <div className="grid gap-4 pt-6">
        <h3 className="m-0 text-xl font-extrabold text-neutral-black">Preguntas</h3>
        {activity.questions.map((question, index) => (
          <section className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={question.id}>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Pregunta {index + 1}</p>
            <h4 className="m-0 mt-1 text-base font-bold text-neutral-black">{question.prompt}</h4>
            {question.options?.length ? (
              <ul className="m-0 mt-3 grid list-none gap-2 p-0">
                {question.options.map((option) => (
                  <li className="rounded-2xl border border-neutral-lightGray bg-neutral-white px-3 py-2 text-sm font-medium text-neutral-black" key={option.id}>
                    {option.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
