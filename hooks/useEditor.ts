import { Block } from "@blocknote/core";
import { defaultReactSlashMenuItems, useBlockNote } from "@blocknote/react";
import { useTheme } from "./useTheme";
import { useState } from "react";
import { blockSchema } from "@/blocknote/blockSchema";
import { slashCommands } from "@/blocknote/slashMenu";

type useEditorArgs = {
  currentTabIndex: number;
};

export function useEditor({ currentTabIndex }: useEditorArgs, deps: unknown[]) {
  const [contents, setContents] = useState<Block<any>[]>([]);
  const theme = useTheme();

  const initialContent = globalThis?.localStorage?.getItem(
    `tab-${currentTabIndex}`
  );

  const editor = useBlockNote(
    {
      theme,
      initialContent: initialContent ? JSON.parse(initialContent) : undefined,
      defaultStyles: false,
      onEditorContentChange: (editor) => {
        setContents(editor.topLevelBlocks);
        globalThis?.localStorage?.setItem(
          `tab-${currentTabIndex}` ?? "tab-0",
          JSON.stringify(editor.topLevelBlocks)
        );
      },
      slashCommands,
      blockSchema,
    },
    deps
  );

  return {
    contents,

    editor,
  };
}
