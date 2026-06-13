import { StudentTaskDetail } from "../../../../../../components/tasks/StudentTaskDetail";

type StudentTaskDetailPageProps = {
  params: Promise<{
    courseId: string;
    taskId: string;
  }>;
};

export default async function StudentTaskDetailPage({ params }: StudentTaskDetailPageProps) {
  const { courseId, taskId } = await params;

  return <StudentTaskDetail courseId={courseId} taskId={taskId} />;
}
