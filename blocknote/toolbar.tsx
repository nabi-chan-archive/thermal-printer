import { BlockNoteEditor } from "@blocknote/core";
import {
  Toolbar,
  ToggledStyleButton,
  TextAlignButton,
  BlockTypeDropdown,
} from "@blocknote/react";

export const CustomFormattingToolbar = (props: { editor: BlockNoteEditor }) => {
  return (
    <Toolbar>
      <BlockTypeDropdown editor={props.editor} />
      <ToggledStyleButton editor={props.editor} toggledStyle={"bold"} />
      <ToggledStyleButton editor={props.editor} toggledStyle={"underline"} />
      <TextAlignButton editor={props.editor} textAlignment={"left"} />
      <TextAlignButton editor={props.editor} textAlignment={"center"} />
      <TextAlignButton editor={props.editor} textAlignment={"right"} />
    </Toolbar>
  );
};
