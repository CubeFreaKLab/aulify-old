"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createCourse } from "../../lib/repositories/courseRepository";

type CreateCourseErrors = {
  description: string;
  name: string;
};

export function CreateCourseForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupLabel, setGroupLabel] = useState("");
  const [errors, setErrors] = useState<CreateCourseErrors>({ description: "", name: "" });

  function validateForm() {
    return {
      name: name.trim() ? "" : "Ingresa el nombre del curso.",
      description: description.trim() ? "" : "Ingresa una descripción del curso."
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.description) {
      return;
    }

    createCourse({ description, groupLabel, name });
    router.push("/teacher/courses");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-3xl border border-neutral-lightGray bg-neutral-white p-5 sm:p-6">
      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Nombre del curso *
        <input
          className={[
            "h-14 rounded-2xl border bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
            errors.name ? "border-[#E5484D] focus:border-[#E5484D]" : "border-neutral-lightGray focus:border-brand-green"
          ].join(" ")}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) {
              setErrors((currentErrors) => ({ ...currentErrors, name: event.target.value.trim() ? "" : currentErrors.name }));
            }
          }}
        />
        {errors.name ? <span className="text-sm font-semibold text-[#E5484D]">{errors.name}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Descripción *
        <textarea
          className={[
            "min-h-32 rounded-2xl border bg-neutral-white px-4 py-3 text-base font-medium leading-7 text-neutral-black outline-none transition duration-base focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]",
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

      <label className="grid gap-2 text-sm font-bold text-neutral-black">
        Grupo o paralelo
        <input
          className="h-14 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 text-base font-medium text-neutral-black outline-none transition duration-base focus:border-brand-green focus:ring-4 focus:ring-[rgba(4,154,78,0.12)]"
          value={groupLabel}
          onChange={(event) => setGroupLabel(event.target.value)}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/teacher/courses"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-black bg-neutral-white px-6 text-base font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-bold text-neutral-white transition duration-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          Crear curso
        </button>
      </div>
    </form>
  );
}
