import type { StudentTaskState, Task } from "../../lib/mock/tasks";
import { TaskCard } from "./TaskCard";

type TasksListProps = {
  actionLabel: string;
  emptyLabel: string;
  getCourseName: (courseId: string) => string;
  getHref: (task: Task) => string;
  getStudentState?: (task: Task) => StudentTaskState;
  getSubmissionsCount?: (taskId: string) => number;
  tasks: Task[];
  variant: "teacher" | "student";
};

export function TasksList({
  actionLabel,
  emptyLabel,
  getCourseName,
  getHref,
  getStudentState,
  getSubmissionsCount,
  tasks,
  variant
}: TasksListProps) {
  if (!tasks.length) {
    return (
      <section className="rounded-3xl border border-neutral-lightGray bg-neutral-white p-6">
        <p className="m-0 text-base font-medium text-neutral-darkGray">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          actionLabel={actionLabel}
          courseName={getCourseName(task.courseId)}
          href={getHref(task)}
          key={`${task.courseId}-${task.id}`}
          studentState={getStudentState?.(task)}
          submissionsCount={getSubmissionsCount?.(task.id)}
          task={task}
          variant={variant}
        />
      ))}
    </section>
  );
}
