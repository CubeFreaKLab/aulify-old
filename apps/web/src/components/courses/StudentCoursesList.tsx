import { CourseCard } from "./CourseCard";
import { studentCourses } from "../../lib/mock/courses";

export function StudentCoursesList() {
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Cursos inscritos">
      {studentCourses.map((course) => (
        <CourseCard actionLabel="Entrar" course={course} href={`/student/courses/${course.id}`} key={course.id} mode="student" />
      ))}
    </section>
  );
}
