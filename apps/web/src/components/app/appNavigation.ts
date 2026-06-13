export type AppRole = "teacher" | "student";

export type AppNavItem = {
  label: string;
  href: string;
};

const navItems = [
  { label: "Dashboard", path: "dashboard" },
  { label: "Cursos", path: "courses" },
  { label: "Notas", path: "notes" },
  { label: "Tareas", path: "tasks" },
  { label: "Actividades", path: "activities" },
  { label: "Progreso", path: "progress" }
] as const;

export function getAppNavigation(role: AppRole): AppNavItem[] {
  const basePath = role === "teacher" ? "/teacher" : "/student";

  return navItems.map((item) => ({
    label: item.label,
    href: `${basePath}/${item.path}`
  }));
}
