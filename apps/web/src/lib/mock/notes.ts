export type NoteStatus = "draft" | "published";

export type Note = {
  content: string;
  courseId: string;
  createdAt: string;
  id: string;
  status: NoteStatus;
  summary: string;
  title: string;
  updatedAt: string;
};

export const noteStatusLabels: Record<NoteStatus, string> = {
  draft: "Borrador",
  published: "Publicado"
};

export const mockNotes: Note[] = [
  {
    id: "guia-funciones-lineales",
    courseId: "matematica-aplicada",
    title: "Guía de funciones lineales",
    summary: "Conceptos base, representación gráfica y ejercicios guiados para la unidad.",
    content:
      "Una función lineal relaciona dos variables mediante una expresión de primer grado. Revisa la pendiente, el intercepto y la forma en que cada cambio se representa en el plano cartesiano. Al terminar, practica con los ejercicios propuestos y compara tus respuestas con los ejemplos resueltos.",
    status: "published",
    createdAt: "2026-05-28T14:00:00.000Z",
    updatedAt: "2026-06-10T16:30:00.000Z"
  },
  {
    id: "repaso-ejercicios-aplicados",
    courseId: "matematica-aplicada",
    title: "Repaso de ejercicios aplicados",
    summary: "Problemas contextualizados para reforzar interpretación de funciones.",
    content:
      "Usa situaciones cotidianas para identificar variables, plantear la función y explicar el significado de cada valor. Trabaja con calma cada problema y justifica el procedimiento utilizado antes de revisar el resultado final.",
    status: "draft",
    createdAt: "2026-06-09T10:00:00.000Z",
    updatedAt: "2026-06-11T12:20:00.000Z"
  },
  {
    id: "transformaciones-sociales",
    courseId: "historia-contemporanea",
    title: "Transformaciones sociales del siglo XX",
    summary: "Lectura breve para conectar procesos políticos, culturales y económicos.",
    content:
      "Durante el siglo XX, los cambios sociales se relacionaron con nuevas formas de organización, participación ciudadana y circulación de información. Lee el material y prepara dos ejemplos que conecten un proceso histórico con su impacto en la vida cotidiana.",
    status: "published",
    createdAt: "2026-05-22T09:15:00.000Z",
    updatedAt: "2026-06-08T18:10:00.000Z"
  },
  {
    id: "estructura-ensayo",
    courseId: "comunicacion-escrita",
    title: "Estructura del ensayo",
    summary: "Guía para organizar tesis, argumentos, evidencia y cierre.",
    content:
      "Un ensayo claro presenta una tesis definida, desarrolla argumentos con evidencia y cierra con una conclusión que retoma la idea principal. Antes de escribir, prepara un esquema breve con cada sección y revisa que las ideas avancen de forma ordenada.",
    status: "published",
    createdAt: "2026-05-18T11:00:00.000Z",
    updatedAt: "2026-06-07T15:45:00.000Z"
  }
];

export function getCourseNotes(courseId: string, notes: Note[] = mockNotes) {
  return notes.filter((note) => note.courseId === courseId);
}

export function getPublishedNotes(notes: Note[] = mockNotes) {
  return notes.filter((note) => note.status === "published");
}

export function findNoteById(courseId: string, noteId: string, notes: Note[] = mockNotes) {
  return notes.find((note) => note.courseId === courseId && note.id === noteId);
}

export function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
