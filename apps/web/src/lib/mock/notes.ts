import type { PartialBlock } from "@blocknote/core";

export type NoteStatus = "draft" | "published";
export type NoteBlockType = "paragraph" | "heading" | "bullet_list" | "checklist" | "quote" | "resource_link" | "divider";

export type NoteChecklistItem = {
  checked: boolean;
  id: string;
  text: string;
};

export type NoteBlock = {
  id: string;
  items?: NoteChecklistItem[] | string[];
  label?: string;
  text?: string;
  type: NoteBlockType;
  url?: string;
};

export type Note = {
  blocks?: NoteBlock[];
  content?: string;
  courseId: string;
  createdAt: string;
  documentBlocks?: PartialBlock[];
  future?: {
    audioRecordingUrl?: string;
    generatedSummary?: string;
    resources?: Array<{ label: string; url: string }>;
    transcript?: string;
  };
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

function createLegacyParagraphBlocks(content?: string): NoteBlock[] {
  return (content ?? "")
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: `legacy-paragraph-${index + 1}`,
      type: "paragraph" as const,
      text
    }));
}

function createLegacyDocumentBlocks(content?: string): PartialBlock[] {
  const paragraphs = (content ?? "")
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);

  return paragraphs.length
    ? paragraphs.map((text) => ({ content: text, type: "paragraph" }))
    : [{ content: "", type: "paragraph" }];
}

export function getRenderableDocumentBlocks(note: Note): PartialBlock[] {
  return note.documentBlocks?.length ? note.documentBlocks : createLegacyDocumentBlocks(note.content);
}

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

export function getRenderableNoteBlocks(note: Note): NoteBlock[] {
  return note.blocks?.length ? note.blocks : createLegacyParagraphBlocks(note.content);
}

export function hasMeaningfulNoteBlocks(blocks: NoteBlock[]) {
  return blocks.some((block) => {
    if (block.type === "divider") {
      return true;
    }

    if (block.text?.trim() || block.label?.trim() || block.url?.trim()) {
      return true;
    }

    if (block.items?.length) {
      return block.items.some((item) => (typeof item === "string" ? item.trim() : item.text.trim()));
    }

    return false;
  });
}

export function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
