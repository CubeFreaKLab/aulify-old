import {
  formatActivityDate,
  getAverageActivityScore,
  type Activity,
  type ActivityAttempt
} from "../../lib/mock/activities";

type ActivityResultsProps = {
  activity: Activity;
  attempts: ActivityAttempt[];
};

export function ActivityResults({ activity, attempts }: ActivityResultsProps) {
  const averageScore = getAverageActivityScore(activity, attempts);

  return (
    <section className="mt-8 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-2xl font-extrabold text-neutral-black">Resultados</h2>
          <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">Respuestas registradas para esta actividad.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-lightGray bg-neutral-offWhite px-3 py-1 text-sm font-bold text-neutral-black">
            {attempts.length} respuestas
          </span>
          {averageScore !== undefined ? (
            <span className="rounded-full border border-brand-green bg-brand-greenLight px-3 py-1 text-sm font-bold text-neutral-black">
              Promedio {averageScore}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {attempts.length ? (
          attempts.map((attempt) => (
            <article className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={attempt.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="m-0 text-base font-bold text-neutral-black">{attempt.studentName}</h3>
                  <p className="m-0 mt-1 text-sm font-medium text-neutral-darkGray">
                    Enviado {formatActivityDate(attempt.submittedAt)}
                  </p>
                </div>
                {attempt.score !== undefined ? (
                  <span className="w-fit rounded-full border border-brand-green bg-neutral-white px-3 py-1 text-xs font-bold text-brand-green">
                    {attempt.score}%
                  </span>
                ) : null}
              </div>
              <p className="m-0 mt-3 text-sm font-medium leading-6 text-neutral-black">
                {attempt.answers
                  .map((answer) => answer.text ?? answer.optionId ?? (answer.booleanAnswer === undefined ? "" : answer.booleanAnswer ? "Verdadero" : "Falso"))
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </article>
          ))
        ) : (
          <p className="m-0 rounded-2xl bg-neutral-offWhite px-4 py-3 text-sm font-medium text-neutral-darkGray">
            Aún no hay respuestas para esta actividad.
          </p>
        )}
      </div>
    </section>
  );
}
