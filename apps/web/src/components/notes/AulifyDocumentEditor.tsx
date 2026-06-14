"use client";

import type { Block, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";
import { aulifyBlockNoteTheme } from "./aulifyBlockNoteTheme";

type AulifyDocumentEditorProps = {
  initialBlocks: PartialBlock[];
  onChange: (blocks: PartialBlock[]) => void;
};

function cloneDocument(blocks: Block[] | PartialBlock[]) {
  return JSON.parse(JSON.stringify(blocks)) as PartialBlock[];
}

export function AulifyDocumentEditor({ initialBlocks, onChange }: AulifyDocumentEditorProps) {
  const editor = useCreateBlockNote({
    animations: true,
    defaultStyles: true,
    dropCursor: {
      color: "#049A4E",
      width: 3
    },
    initialContent: initialBlocks,
    // TODO: Add column/layout blocks through a proper BlockNote extension when a stable insert path is available.
    domAttributes: {
      editor: {
        class: "aulify-document-editor"
      }
    }
  });

  useEffect(() => {
    onChange(cloneDocument(editor.document));
  }, [editor, onChange]);

  return (
    <div className="aulify-blocknote-shell">
      <BlockNoteView editor={editor} theme={aulifyBlockNoteTheme} onChange={() => onChange(cloneDocument(editor.document))} />
    </div>
  );
}
