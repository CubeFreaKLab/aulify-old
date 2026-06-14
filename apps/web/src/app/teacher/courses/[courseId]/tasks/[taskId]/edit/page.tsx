import { TeacherTaskEditor } from "../../../../../../../components/tasks/TeacherTaskEditor";

type EditTeacherTaskPageProps = {
  params: Promise<{
    courseId: string;
    taskId: string;
  }>;
};

export default async function EditTeacherTaskPage({ params }: EditTeacherTaskPageProps) {
  const { courseId, taskId } = await params;

  return <TeacherTaskEditor courseId={courseId} taskId={taskId} />;
}
