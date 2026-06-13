import { StudentNoteDetail } from "../../../../../../components/notes/StudentNoteDetail";

type StudentNoteDetailPageProps = {
  params: Promise<{
    courseId: string;
    noteId: string;
  }>;
};

export default async function StudentNoteDetailPage({ params }: StudentNoteDetailPageProps) {
  const { courseId, noteId } = await params;

  return <StudentNoteDetail courseId={courseId} noteId={noteId} />;
}
