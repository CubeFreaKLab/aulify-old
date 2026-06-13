import { TeacherNoteEditor } from "../../../../../../../components/notes/TeacherNoteEditor";

type TeacherNoteEditPageProps = {
  params: Promise<{
    courseId: string;
    noteId: string;
  }>;
};

export default async function TeacherNoteEditPage({ params }: TeacherNoteEditPageProps) {
  const { courseId, noteId } = await params;

  return <TeacherNoteEditor courseId={courseId} noteId={noteId} />;
}
