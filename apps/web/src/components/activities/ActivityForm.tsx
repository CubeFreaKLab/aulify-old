"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createStoredTeacherActivity } from "../../lib/activityStorage";
import type { ActivityOption, ActivityQuestion, ActivityStatus, ActivityType } from "../../lib/mock/activities";

type ActivityFormProps = {
  courseId: string;
};

type ActivityFormErrors = {
  correctAnswer: string;
  description: string;
  options: string;
  question: string;
  title: string;
};

const typeOptions: Array<{ label: string; value: ActivityType }> = [
  { label: "Quiz", value: "quiz" },
  { label: "Verdadero/Falso", value: "true_false" },
  { label: "Pregunta rápida", value: "quick_question" },
  { label: "Encuesta", value: "poll" }
];

const statusOptions: Array<{ label: string; value: Exclude<ActivityStatus, "closed"> }> = [
  { label: "Borrador", value: "draft" },
  { label: "Publicada", value: "published" }
];

const optionIds = ["option-a", "option-b", "option-c", "option-d"];

function buildOptions(optionTexts: string[]) {
  return optionTexts
    .map<ActivityOption>((label, index) => ({ id: optionIds[index] ?? `option-${index + 1}`, label: label.trim() }))
    .filter((option) => option.label);
}

export function ActivityForm({ courseId }: ActivityFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ActivityType>("quiz");
  const [status, setStatus] = useState<Exclude<ActivityStatus, "closed">>("draft");
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [optionTexts, setOptionTexts] = useState(["", "", "", ""]);
  const [correctOptionId, setCorrectOptionId] = useState("");
  const [correctBoolean, setCorrectBoolean] = useState<boolean | undefined>(undefined);
  const [errors, setErrors] = useState<ActivityFormErrors>({
    correctAnswer: "",
    description: "",
    options: "",
    question: "",
    title: ""
  });

  function validateForm() {
    const options = buildOptions(optionTexts);
    const needsOptions = type === "quiz" || type === "poll";
    const minOptions = type === "quiz" ? 3 : 2;

    return {
      title: title.trim() ? "" : "Ingresa el título de la actividad.",
      description: description.trim() ? "" : "Ingresa una descripción breve.",
      question: questionPrompt.trim() ? "" : "Ingresa la pregunta de la actividad.",
      options: needsOptions && options.length < minOptions ? "Completa las opciones de respuesta." : "",
      correctAnswer:
        (type === "quiz" && (!correctOptionId || !options.some((option) => option.id === correctOptionId))) ||
        (type === "true_false" && correctBoolean === undefined)
          ? "Selecciona la respuesta correcta."
          : ""
    };
  }

  function createQuestion() {
    const baseQuestion: ActivityQuestion = {
      id: "question-main",
      prompt: questionPrompt.trim()
    };

    if (type === "quiz") {
      return {
        ...baseQuestion,
        options: buildOptions(optionTexts),
        correctOptionId
      };
    }

    if (type === "poll") {
      return {
        ...baseQuestion,
        options: buildOptions(optionTexts)
      };
    }

    if (type === "true_false") {
      return {
        ...baseQuestion,
        correctBoolean
      };
    }

    return baseQuestion;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.title || nextErrors.description || nextErrors.question || nextErrors.options || nextErrors.correctAnswer) {
      return;
    }

    const activity = createStoredTeacherActivity({
      courseId,
      description,
      questions: [createQuestion()],
      status,
      title,
      type
    });

    router.push(`/teacher/courses/${courseId}/activities/${activity.id}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Título de la actividad *
        <input
          className={[
            "h-14 rounded-2xl border bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.title ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              setErrors((currentErrors) => ({ ...currentErrors, title: event.target.value.trim() ? "" : currentErrors.title }));
            }
          }}
        />
        {errors.title ? <span className="text-sm font-semibold text-[#E5484D]">{errors.title}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Descripción breve *
        <textarea
          className={[
            "min-h-24 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.description ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (errors.description) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                description: event.target.value.trim() ? "" : currentErrors.description
              }));
            }
          }}
        />
        {errors.description ? <span className="text-sm font-semibold text-[#E5484D]">{errors.description}</span> : null}
      </label>

      <div className="grid gap-2">
        <p className="m-0 text-sm font-bold text-neutral-black">Tipo de actividad *</p>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((option) => {
            const isSelected = option.value === type;

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
                  setType(option.value);
                  setCorrectOptionId("");
                  setCorrectBoolean(undefined);
                  setErrors((currentErrors) => ({ ...currentErrors, correctAnswer: "", options: "" }));
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Pregunta de la actividad *
        <textarea
          className={[
            "min-h-24 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.question ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={questionPrompt}
          onChange={(event) => {
            setQuestionPrompt(event.target.value);
            if (errors.question) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                question: event.target.value.trim() ? "" : currentErrors.question
              }));
            }
          }}
        />
        {errors.question ? <span className="text-sm font-semibold text-[#E5484D]">{errors.question}</span> : null}
      </label>

      {type === "quiz" || type === "poll" ? (
        <div className="grid gap-3">
          <p className="m-0 text-sm font-bold text-neutral-black">{type === "quiz" ? "Opciones y respuesta correcta" : "Opciones de encuesta"}</p>
          {optionTexts.map((optionText, index) => {
            const optionId = optionIds[index] ?? `option-${index + 1}`;

            return (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]" key={optionId}>
                <input
                  className="h-14 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
                  placeholder={`Opción ${index + 1}`}
                  value={optionText}
                  onChange={(event) => {
                    const nextOptions = [...optionTexts];
                    nextOptions[index] = event.target.value;
                    setOptionTexts(nextOptions);
                    if (errors.options) {
                      setErrors((currentErrors) => ({
                        ...currentErrors,
                        options: buildOptions(nextOptions).length >= (type === "quiz" ? 3 : 2) ? "" : currentErrors.options
                      }));
                    }
                  }}
                />
                {type === "quiz" ? (
                  <button
                    type="button"
                    className={[
                      "min-h-12 rounded-full border px-4 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                      correctOptionId === optionId
                        ? "border-brand-green bg-brand-green text-neutral-white"
                        : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                    ].join(" ")}
                    onClick={() => {
                      setCorrectOptionId(optionId);
                      setErrors((currentErrors) => ({ ...currentErrors, correctAnswer: "" }));
                    }}
                  >
                    Correcta
                  </button>
                ) : null}
              </div>
            );
          })}
          {errors.options ? <span className="text-sm font-semibold text-[#E5484D]">{errors.options}</span> : null}
          {errors.correctAnswer ? <span className="text-sm font-semibold text-[#E5484D]">{errors.correctAnswer}</span> : null}
        </div>
      ) : null}

      {type === "true_false" ? (
        <div className="grid gap-2">
          <p className="m-0 text-sm font-bold text-neutral-black">Respuesta correcta</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Verdadero", value: true },
              { label: "Falso", value: false }
            ].map((option) => {
              const isSelected = correctBoolean === option.value;

              return (
                <button
                  type="button"
                  className={[
                    "min-h-11 rounded-full border px-5 text-sm font-bold transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                    isSelected
                      ? "border-brand-green bg-brand-green text-neutral-white"
                      : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                  ].join(" ")}
                  key={option.label}
                  onClick={() => {
                    setCorrectBoolean(option.value);
                    setErrors((currentErrors) => ({ ...currentErrors, correctAnswer: "" }));
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {errors.correctAnswer ? <span className="text-sm font-semibold text-[#E5484D]">{errors.correctAnswer}</span> : null}
        </div>
      ) : null}

      <div className="grid gap-2">
        <p className="m-0 text-sm font-bold text-neutral-black">Estado</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const isSelected = option.value === status;

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
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Guardar actividad
        </button>
      </div>
    </form>
  );
}
