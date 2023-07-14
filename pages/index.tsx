import { useState } from "react";
import axios from "axios";
import {
  BlockNoteView,
  useBlockNote,
  defaultReactSlashMenuItems,
} from "@blocknote/react";
import { Blocks, LineBlock } from "@/blocknote/blocks";
import { Block, defaultBlockSchema } from "@blocknote/core";
import { CustomDragHandleMenu } from "@/blocknote/sideMenu";
import { CustomFormattingToolbar } from "@/blocknote/toolbar";

export default function Home() {
  const [contents, setContents] = useState<Block<any>[]>([]);

  async function submit() {
    axios.post("/api/printer", contents);
  }

  const editor = useBlockNote({
    onEditorContentChange: (editor) => {
      setContents(editor.topLevelBlocks);
    },
    slashCommands: [...defaultReactSlashMenuItems, ...Blocks],
    blockSchema: {
      ...defaultBlockSchema,
      line: LineBlock,
    },
    customElements: {
      dragHandleMenu: CustomDragHandleMenu as any,
      formattingToolbar: CustomFormattingToolbar as any,
    },
  });

  return (
    <main className="p-4 font-mono main">
      <BlockNoteView editor={editor} />

      <div className="flex justify-end mt-8">
        <button className="btn btn-sm" onClick={submit}>
          전송하기
        </button>
      </div>
    </main>
  );
}
