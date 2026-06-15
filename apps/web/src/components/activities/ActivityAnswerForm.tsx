"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  activityTypeLabels,
  formatActivityDate,
  type Activity,
  type ActivityAnswer,
  type ActivityAttempt
} from "../../lib/mock/activities";
import { submitActivityAttemptAsync } from "../../lib/repositories/activityRepository";

type ActivityAnswerFormProps = {
  activity: Activity;
  existingAttempt?: ActivityAttempt;
};

function getAnswerText(activity: Activity, answer: ActivityAnswer) {
  const question = activity.questions.find((currentQuestion) => currentQuestion.id === answer.questionId);

  if (answer.text) {
    return answer.text;
  }

  if (answer.optionId) {
    return question?.options?.find((option) => option.id === answer.optionId)?.label ?? answer.optionId;
  }

  if (answer.booleanAnswer !== undefined) {
    return answer.booleanAnswer ? "Verdadero" : "Falso";
  }

  return "";
}

function getCorrectAnswerText(activity: Activity, answer: ActivityAnswer) {
  const question = activity.questions.find((currentQuestion) => currentQuestion.id === answer.questionId);

  if (!question) {
    return "";
  }

  if (question.correctOptionId) {
    return question.options?.find((option) => option.id === question.correctOptionId)?.label ?? "";
  }

  if (question.correctBoolean !== undefined) {
    return question.correctBoolean ? "Verdadero" : "Falso";
  }

  return "";
}

function getAnswerIsCorrect(activity: Activity, answer: ActivityAnswer) {
  const question = activity.questions.find((currentQuestion) => currentQuestion.id === answer.questionId);

  if (!question) {
    return undefined;
  }

  if (question.correctOptionId) {
    return answer.optionId === question.correctOptionId;
  }

  if (question.correctBoolean !== undefined) {
    return answer.booleanAnswer === question.correctBoolean;
  }

  return undefined;
}

export function ActivityAnswerForm({ activity, existingAttempt }: ActivityAnswerFormProps) {
  const [attempt, setAttempt] = useState<ActivityAttempt | undefined>(existingAttempt);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAttempt(existingAttempt);
  }, [existingAttempt]);

  function buildAnswers() {
    return activity.questions.map<ActivityAnswer>((question) => {
      const answerValue = answers[question.id] ?? "";

      if (activity.type === "quick_question") {
        return { questionId: question.id, text: answerValue.trim() };
      }

      if (activity.type === "true_false") {
        return { questionId: question.id, booleanAnswer: answerValue === "true" };
      }

      return { questionId: question.id, optionId: answerValue };
    });
  }

  function hasMissingAnswer() {
    return activity.questions.some((question) => !(answers[question.id] ?? "").trim());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (hasMissingAnswer()) {
      setError("Responde la actividad antes de enviarla.");
      return;
    }

    try {
      setIsSubmitting(true);
      const nextAttempt = await submitActivityAttemptAsync({ activity, answers: buildAnswers() });
      setAttempt(nextAttempt);
      setAnswers({});
      setError("");
    } catch {
      setSubmitError("No se pudo enviar tus respuestas.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (attempt) {
    return (
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="m-0 text-sm font-semibold text-brand-green">{activityTypeLabels[activity.type]}</p>
            <h2 className="m-0 mt-1 text-2xl font-extrabold text-neutral-black">Actividad completada</h2>
            <p className="m-0 mt-2 text-sm font-semibold text-neutral-darkGray">Enviada el {formatActivityDate(attempt.submittedAt)}</p>
          </div>
          {attempt.score !== undefined ? (
            <div className="rounded-2xl bg-neutral-offWhite px-4 py-3 text-left sm:text-right">
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Resultado</p>
              <p className="m-0 mt-1 text-3xl font-extrabold text-neutral-black">{attempt.score}%</p>
            </div>
          ) : null}
        </div>
        {attempt.score === undefined ? (
          <p className="m-0 mt-5 rounded-2xl bg-neutral-offWhite px-4 py-3 text-base font-bold text-neutral-black">
            Respuestas enviadas correctamente.
          </p>
        ) : null}
        <div className="mt-5 grid gap-3">
          {attempt.answers.map((answer, index) => {
            const question = activity.questions.find((currentQuestion) => currentQuestion.id === answer.questionId);
            const isCorrect = getAnswerIsCorrect(activity, answer);
            const correctAnswerText = getCorrectAnswerText(activity, answer);

            return (
              <article className="rounded-2xl bg-neutral-offWhite px-4 py-3" key={answer.questionId}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Pregunta {index + 1}</p>
                    <h3 className="m-0 mt-1 text-base font-bold text-neutral-black">{question?.prompt}</h3>
                  </div>
                  {isCorrect !== undefined ? (
                    <span
                      className={[
                        "w-fit rounded-full border px-3 py-1 text-xs font-bold",
                        isCorrect
                          ? "border-brand-green bg-brand-greenLight text-neutral-black"
                          : "border-neutral-lightGray bg-neutral-white text-neutral-darkGray"
                      ].join(" ")}
                    >
                      {isCorrect ? "Correcta" : "Incorrecta"}
                    </span>
                  ) : null}
                </div>
                <p className="m-0 mt-3 text-sm font-semibold text-neutral-darkGray">Tu respuesta</p>
                <p className="m-0 mt-1 text-base font-bold text-neutral-black">{getAnswerText(activity, answer)}</p>
                {isCorrect === false && correctAnswerText ? (
                  <>
                    <p className="m-0 mt-3 text-sm font-semibold text-neutral-darkGray">Respuesta correcta</p>
                    <p className="m-0 mt-1 text-base font-bold text-neutral-black">{correctAnswerText}</p>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="m-0 text-sm font-semibold text-brand-green">{activityTypeLabels[activity.type]}</p>
          <h2 className="m-0 mt-1 text-2xl font-extrabold text-neutral-black">Responder actividad</h2>
        </div>
      </div>
      {activity.questions.map((question, index) => (
        <fieldset className="grid gap-3 border-0 p-0" key={question.id}>
          <legend className="text-base font-extrabold text-neutral-black">
            {index + 1}. {question.prompt}
          </legend>

          {activity.type === "quiz" || activity.type === "poll" ? (
            <div className="grid gap-2">
              {question.options?.map((option) => {
                const isSelected = answers[question.id] === option.id;

                return (
                  <button
                    type="button"
                    className={[
                      "min-h-12 rounded-2xl border px-4 text-left text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                      isSelected
                        ? "border-brand-green bg-brand-green text-neutral-white"
                        : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                    ].join(" ")}
                    key={option.id}
                    onClick={() => {
                      setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: option.id }));
                      setError("");
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {activity.type === "true_false" ? (
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Verdadero", value: "true" },
                { label: "Falso", value: "false" }
              ].map((option) => {
                const isSelected = answers[question.id] === option.value;

                return (
                  <button
                    type="button"
                    className={[
                      "min-h-11 rounded-full border px-5 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                      isSelected
                        ? "border-brand-green bg-brand-green text-neutral-white"
                        : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                    ].join(" ")}
                    key={option.value}
                    onClick={() => {
                      setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: option.value }));
                      setError("");
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {activity.type === "quick_question" ? (
            <textarea
              className={[
                "min-h-40 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
                error ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
              ].join(" ")}
              value={answers[question.id] ?? ""}
              onChange={(event) => {
                setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: event.target.value }));
                if (error) {
                  setError(event.target.value.trim() ? "" : error);
                }
              }}
            />
          ) : null}
        </fieldset>
      ))}

      {error ? <span className="text-sm font-semibold text-[#E5484D]">{error}</span> : null}
      {submitError ? <span className="text-sm font-semibold text-[#E5484D]">{submitError}</span> : null}

      <div className="flex justify-end">
        <button
          disabled={isSubmitting}
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Enviando respuestas..." : "Enviar respuestas"}
        </button>
      </div>
    </form>
  );
}
