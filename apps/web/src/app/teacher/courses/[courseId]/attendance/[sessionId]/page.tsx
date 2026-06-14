import { AttendanceSessionForm } from "../../../../../../components/attendance/AttendanceSessionForm";

type TeacherAttendanceSessionPageProps = {
  params: Promise<{
    courseId: string;
    sessionId: string;
  }>;
};

export default async function TeacherAttendanceSessionPage({ params }: TeacherAttendanceSessionPageProps) {
  const { courseId, sessionId } = await params;

  return <AttendanceSessionForm courseId={courseId} sessionId={sessionId} />;
}
