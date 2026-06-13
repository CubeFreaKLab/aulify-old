import { TeacherTaskDetail } from "../../../../../../components/tasks/TeacherTaskDetail";

type TeacherTaskDetailPageProps = {
  params: Promise<{
    courseId: string;
    taskId: string;
  }>;
};

export default async function TeacherTaskDetailPage({ params }: TeacherTaskDetailPageProps) {
  const { courseId, taskId } = await params;

  return <TeacherTaskDetail courseId={courseId} taskId={taskId} />;
}
