import { TeacherAttendanceOverview } from "../../../../../components/attendance/TeacherAttendanceOverview";

type TeacherAttendancePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function TeacherAttendancePage({ params }: TeacherAttendancePageProps) {
  const { courseId } = await params;

  return <TeacherAttendanceOverview courseId={courseId} />;
}
