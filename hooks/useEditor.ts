import { Blocks, LineBlock } from "@/blocknote/blocks";
import { CustomDragHandleMenu } from "@/blocknote/sideMenu";
import { CustomFormattingToolbar } from "@/blocknote/toolbar";
import { Block, defaultBlockSchema } from "@blocknote/core";
import { defaultReactSlashMenuItems, useBlockNote } from "@blocknote/react";
import { useTheme } from "./useTheme";
import { useState } from "react";

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
      onEditorContentChange: (editor) => {
        setContents(editor.topLevelBlocks);
        globalThis?.localStorage?.setItem(
          `tab-${currentTabIndex}` ?? "tab-0",
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
    },
    deps
  );

  return {
    contents,

    editor,
  };
}
