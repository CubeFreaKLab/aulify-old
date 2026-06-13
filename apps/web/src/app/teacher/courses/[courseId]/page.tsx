import { TeacherCourseDetail } from "../../../../components/courses/TeacherCourseDetail";

type TeacherCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function TeacherCourseDetailPage({ params }: TeacherCourseDetailPageProps) {
  const { courseId } = await params;

  return <TeacherCourseDetail courseId={courseId} />;
}
