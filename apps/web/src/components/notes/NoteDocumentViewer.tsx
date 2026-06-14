"use client";

import type { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { aulifyBlockNoteTheme } from "./aulifyBlockNoteTheme";

type NoteDocumentViewerProps = {
  blocks: PartialBlock[];
};

export function NoteDocumentViewer({ blocks }: NoteDocumentViewerProps) {
  const editor = useCreateBlockNote({
    defaultStyles: true,
    initialContent: blocks,
    domAttributes: {
      editor: {
        class: "aulify-document-viewer"
      }
    }
  });

  return (
    <div className="aulify-blocknote-readonly">
      <BlockNoteView editor={editor} editable={false} theme={aulifyBlockNoteTheme} />
    </div>
  );
}
