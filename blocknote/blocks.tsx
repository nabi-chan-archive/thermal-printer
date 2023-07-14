import {
  BlockNoteEditor,
  DefaultBlockSchema,
  PartialBlock,
} from "@blocknote/core";
import { ReactSlashMenuItem, createReactBlockSpec } from "@blocknote/react";
import { AiOutlineLine } from "react-icons/ai";

function insertOrUpdateBlock<BSchema extends DefaultBlockSchema>(
  editor: BlockNoteEditor<BSchema>,
  block: PartialBlock<BSchema>
) {
  const currentBlock = editor.getTextCursorPosition().block;

  if (
    (currentBlock.content.length === 1 &&
      currentBlock.content[0].type === "text" &&
      currentBlock.content[0].text === "/") ||
    currentBlock.content.length === 0
  ) {
    editor.updateBlock(currentBlock, block);
  } else {
    editor.insertBlocks([block], currentBlock, "after");
    editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock!);
  }
}

export const LineBlock = createReactBlockSpec({
  type: "line",
  propSchema: {},
  containsInlineContent: false,
  render: () => <hr />,
});

const line = new ReactSlashMenuItem<
  DefaultBlockSchema & { line: typeof LineBlock }
>(
  "line",
  (editor) =>
    insertOrUpdateBlock(editor, {
      type: "line",
    }),
  ["line", "hr", "---"],
  "thermal-printer",
  <AiOutlineLine />
);

export const Blocks = [line];
