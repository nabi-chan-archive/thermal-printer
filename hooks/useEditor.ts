import { Block, defaultBlockSchema } from "@blocknote/core";
import { useBlockNote } from "@blocknote/react";
import { useState } from "react";
import { slashCommands } from "@/blocknote/slashCommands";
import { customBlockSchema } from "@/blocknote/blockSchema";

type useEditorArgs = {
  currentTabIndex: number;
};

export function useEditor({ currentTabIndex }: useEditorArgs, deps: unknown[]) {
  const [contents, setContents] = useState<Block<any>[]>([]);

  const initialContent = globalThis?.localStorage?.getItem(
    `tab-${currentTabIndex}`
  );

  const editor = useBlockNote(
    {
      initialContent: initialContent ? JSON.parse(initialContent) : undefined,
      onEditorContentChange: (editor) => {
        setContents(editor.topLevelBlocks);
        globalThis?.localStorage?.setItem(
          `tab-${currentTabIndex}` ?? "tab-0",
          JSON.stringify(editor.topLevelBlocks)
        );
      },
      slashCommands,
      blockSchema: {
        ...defaultBlockSchema,
        ...customBlockSchema,
      },
    },
    deps
  );

  return {
    contents,

    editor,
  };
}
