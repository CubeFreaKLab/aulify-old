import { StudentAttendanceOverview } from "../../../../../components/attendance/StudentAttendanceOverview";

type StudentAttendancePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function StudentAttendancePage({ params }: StudentAttendancePageProps) {
  const { courseId } = await params;

  return <StudentAttendanceOverview courseId={courseId} />;
}
