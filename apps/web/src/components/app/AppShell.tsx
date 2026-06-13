import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { type AppRole, getAppNavigation } from "./appNavigation";

type AppShellProps = {
  activeHref: string;
  children: ReactNode;
  primaryAction: ReactNode;
  role: AppRole;
  subtitle: string;
  title: string;
};

export function AppShell({ activeHref, children, primaryAction, role, subtitle, title }: AppShellProps) {
  const navigation = getAppNavigation(role);

  return (
    <div className="min-h-screen bg-neutral-offWhite text-neutral-black lg:grid lg:grid-cols-[280px_1fr]">
      <AppSidebar activeHref={activeHref} items={navigation} role={role} />
      <div className="min-w-0">
        <AppTopbar activeHref={activeHref} items={navigation} primaryAction={primaryAction} subtitle={subtitle} title={title} />
        <main className="mx-auto w-full max-w-[1240px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
