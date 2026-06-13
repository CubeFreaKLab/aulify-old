import Link from "next/link";
import type { AppNavItem, AppRole } from "./appNavigation";
import { getRoleLabel, type MockSession } from "../../lib/repositories/authRepository";

type AppSidebarProps = {
  activeHref: string;
  items: AppNavItem[];
  role: AppRole;
  session: MockSession;
};

const roleLabels: Record<AppRole, string> = {
  teacher: "Profesor",
  student: "Estudiante"
};

export function AppSidebar({ activeHref, items, role, session }: AppSidebarProps) {
  return (
    <aside className="hidden min-h-screen border-r border-neutral-lightGray bg-neutral-white px-6 py-7 lg:flex lg:flex-col">
      <Link href={role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} className="block w-fit" aria-label="Aulify dashboard">
        <img className="h-12 w-auto select-none" src="/assets/logos/aulify-logo.svg" alt="Aulify" draggable={false} />
      </Link>

      <div className="mt-8 rounded-2xl border border-neutral-lightGray bg-neutral-offWhite px-4 py-3">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Área</p>
        <p className="m-0 mt-1 text-lg font-bold text-neutral-black">{roleLabels[role]}</p>
      </div>

      <div className="mt-3 rounded-2xl border border-neutral-lightGray bg-neutral-white px-4 py-3">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-darkGray">Sesión</p>
        <p className="m-0 mt-1 text-sm font-bold text-neutral-black">{session.name}</p>
        <p className="m-0 mt-1 text-xs font-semibold text-brand-green">{getRoleLabel(session.role)}</p>
      </div>

      <nav className="mt-8 grid gap-2" aria-label="Navegación interna">
        {items.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <Link
              className={[
                "rounded-2xl px-4 py-3 text-base font-semibold transition-colors duration-base",
                isActive ? "bg-brand-green text-neutral-white" : "text-neutral-black hover:bg-neutral-offWhite hover:text-brand-green"
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
