import { TeacherNoteDetail } from "../../../../../../components/notes/TeacherNoteDetail";

type TeacherNoteDetailPageProps = {
  params: Promise<{
    courseId: string;
    noteId: string;
  }>;
};

export default async function TeacherNoteDetailPage({ params }: TeacherNoteDetailPageProps) {
  const { courseId, noteId } = await params;

  return <TeacherNoteDetail courseId={courseId} noteId={noteId} />;
}
