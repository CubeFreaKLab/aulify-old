"use client";

export type AuthRole = "teacher" | "student";

type AuthRoleSelectorProps = {
  value: AuthRole;
  onChange: (value: AuthRole) => void;
};

const roles: Array<{ label: string; value: AuthRole }> = [
  { label: "Profesor", value: "teacher" },
  { label: "Estudiante", value: "student" }
];

export function AuthRoleSelector({ onChange, value }: AuthRoleSelectorProps) {
  return (
    <div className="grid gap-2">
      <div className="grid h-16 grid-cols-2 rounded-full border-[1.5px] border-neutral-lightGray bg-neutral-white p-1">
        {roles.map((role) => {
          const isSelected = value === role.value;

          return (
            <button
              type="button"
              key={role.value}
              aria-pressed={isSelected}
              onClick={() => onChange(role.value)}
              className={[
                "rounded-full text-base font-semibold transition duration-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2",
                isSelected ? "bg-brand-green text-neutral-white" : "bg-neutral-white text-neutral-black hover:bg-neutral-offWhite"
              ].join(" ")}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
