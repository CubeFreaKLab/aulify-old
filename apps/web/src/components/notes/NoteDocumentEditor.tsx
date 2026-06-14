"use client";

import type { Block, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";
import { aulifyBlockNoteTheme } from "./aulifyBlockNoteTheme";

type NoteDocumentEditorProps = {
  initialBlocks: PartialBlock[];
  onChange: (blocks: PartialBlock[]) => void;
};

function cloneDocument(blocks: Block[] | PartialBlock[]) {
  return JSON.parse(JSON.stringify(blocks)) as PartialBlock[];
}

export function NoteDocumentEditor({ initialBlocks, onChange }: NoteDocumentEditorProps) {
  const editor = useCreateBlockNote({
    animations: true,
    defaultStyles: true,
    initialContent: initialBlocks,
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
