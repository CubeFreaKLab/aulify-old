import { StudentActivityDetail } from "../../../../../../components/activities/StudentActivityDetail";

type StudentActivityDetailPageProps = {
  params: Promise<{
    activityId: string;
    courseId: string;
  }>;
};

export default async function StudentActivityDetailPage({ params }: StudentActivityDetailPageProps) {
  const { activityId, courseId } = await params;

  return <StudentActivityDetail activityId={activityId} courseId={courseId} />;
}
