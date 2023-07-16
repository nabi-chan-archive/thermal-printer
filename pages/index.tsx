import { useState } from "react";
import axios, { AxiosError } from "axios";
import {
  BlockNoteView,
  useBlockNote,
  defaultReactSlashMenuItems,
} from "@blocknote/react";
import { Blocks, LineBlock } from "@/blocknote/blocks";
import { Block, defaultBlockSchema } from "@blocknote/core";
import { CustomDragHandleMenu } from "@/blocknote/sideMenu";
import { CustomFormattingToolbar } from "@/blocknote/toolbar";
import { toast } from "react-toastify";
import { useTheme } from "@/hooks/useTheme";

export default function Home() {
  const [contents, setContents] = useState<Block<any>[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const theme = useTheme();

  async function submit() {
    try {
      setIsPrinting(true);
      const response = await axios.post("/api/printer", contents);
      if (response.data.success) toast.success("프린트를 완료했습니다.");
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }
    } finally {
      setIsPrinting(false);
    }
  }

  const initialContent = globalThis?.localStorage?.getItem("editorContent");

  const editor = useBlockNote({
    theme,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      setContents(editor.topLevelBlocks);
      globalThis?.localStorage?.setItem(
        "editorContent",
        JSON.stringify(editor.topLevelBlocks)
      );
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
        <button disabled={isPrinting} className="btn btn-sm" onClick={submit}>
          전송하기
        </button>
      </div>
    </main>
  );
}
