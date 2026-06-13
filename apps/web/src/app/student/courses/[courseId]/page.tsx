import { StudentCourseDetail } from "../../../../components/courses/StudentCourseDetail";

type StudentCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function StudentCourseDetailPage({ params }: StudentCourseDetailPageProps) {
  const { courseId } = await params;

  return <StudentCourseDetail courseId={courseId} />;
}
