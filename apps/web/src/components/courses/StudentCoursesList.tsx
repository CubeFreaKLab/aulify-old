import { CourseCard } from "./CourseCard";
import { getInitialCourses } from "../../lib/repositories/courseRepository";

export function StudentCoursesList() {
  const courses = getInitialCourses("student");

  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Cursos inscritos">
      {courses.map((course) => (
        <CourseCard actionLabel="Entrar" course={course} href={`/student/courses/${course.id}`} key={course.id} mode="student" />
      ))}
    </section>
  );
}
