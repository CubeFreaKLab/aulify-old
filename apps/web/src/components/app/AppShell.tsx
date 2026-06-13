"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { type AppRole, getAppNavigation } from "./appNavigation";
import { clearCurrentSession, getDashboardPathForSession, type MockSession } from "../../lib/repositories/authRepository";
import { useMockSession } from "../../lib/useMockSession";

type AppShellProps = {
  activeHref: string;
  children: ReactNode;
  primaryAction: ReactNode;
  role: AppRole;
  subtitle: string;
  title: string;
};

export function AppShell({ activeHref, children, primaryAction, role, subtitle, title }: AppShellProps) {
  const router = useRouter();
  const { hasLoadedSession, session } = useMockSession();
  const navigation = getAppNavigation(role);

  useEffect(() => {
    if (!hasLoadedSession) {
      return;
    }

    if (!session) {
      router.replace("/auth/login");
      return;
    }

    if (session.role !== role) {
      router.replace(getDashboardPathForSession(session));
    }
  }, [hasLoadedSession, role, router, session]);

  function handleLogout() {
    clearCurrentSession();
    router.replace("/auth/login");
  }

  if (!hasLoadedSession || !session || session.role !== role) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-offWhite px-5 text-neutral-black">
        <div className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6 text-center">
          <p className="m-0 text-sm font-semibold text-brand-green">Aulify</p>
          <p className="m-0 mt-2 text-base font-bold text-neutral-black">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-offWhite text-neutral-black lg:grid lg:grid-cols-[280px_1fr]">
      <AppSidebar activeHref={activeHref} items={navigation} role={role} session={session as MockSession} />
      <div className="min-w-0">
        <AppTopbar
          activeHref={activeHref}
          items={navigation}
          onLogout={handleLogout}
          primaryAction={primaryAction}
          session={session}
          subtitle={subtitle}
          title={title}
        />
        <main className="mx-auto w-full max-w-[1240px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
