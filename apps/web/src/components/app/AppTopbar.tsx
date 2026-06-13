import Link from "next/link";
import type { ReactNode } from "react";
import type { AppNavItem } from "./appNavigation";
import { getRoleLabel, type MockSession } from "../../lib/mockAuth";

type AppTopbarProps = {
  activeHref: string;
  items: AppNavItem[];
  onLogout: () => void;
  primaryAction: ReactNode;
  session: MockSession;
  subtitle: string;
  title: string;
};

export function AppTopbar({ activeHref, items, onLogout, primaryAction, session, subtitle, title }: AppTopbarProps) {
  return (
    <header className="border-b border-neutral-lightGray bg-neutral-white">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="m-0 text-sm font-semibold text-brand-green">Aulify</p>
            <h1 className="m-0 mt-1 text-3xl font-extrabold leading-tight text-neutral-black sm:text-4xl">{title}</h1>
            <p className="m-0 mt-2 max-w-2xl text-base font-medium leading-7 text-neutral-darkGray">{subtitle}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {primaryAction}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-lightGray bg-neutral-offWhite px-3 py-2">
              <div>
                <p className="m-0 text-sm font-bold leading-tight text-neutral-black">{session.name}</p>
                <p className="m-0 mt-1 text-xs font-semibold leading-tight text-brand-green">{getRoleLabel(session.role)}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-neutral-black bg-neutral-white px-3 py-2 text-xs font-bold text-neutral-black transition-colors duration-base hover:border-brand-green hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Navegación interna móvil">
          {items.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-base",
                  isActive
                    ? "border-brand-green bg-brand-green text-neutral-white"
                    : "border-neutral-lightGray bg-neutral-white text-neutral-black hover:border-brand-green hover:text-brand-green"
                ].join(" ")}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
