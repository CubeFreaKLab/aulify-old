import { TeacherActivityDetail } from "../../../../../../components/activities/TeacherActivityDetail";

type TeacherActivityDetailPageProps = {
  params: Promise<{
    activityId: string;
    courseId: string;
  }>;
};

export default async function TeacherActivityDetailPage({ params }: TeacherActivityDetailPageProps) {
  const { activityId, courseId } = await params;

  return <TeacherActivityDetail activityId={activityId} courseId={courseId} />;
}
