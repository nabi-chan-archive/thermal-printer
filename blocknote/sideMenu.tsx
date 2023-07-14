import { Block, BlockNoteEditor } from "@blocknote/core";
import {
  DragHandleMenu,
  DragHandleMenuItem,
  RemoveBlockButton,
} from "@blocknote/react";
import "@blocknote/core/style.css";

export const CustomDragHandleMenu = (props: {
  editor: BlockNoteEditor;
  block: Block<any>;
  closeMenu: () => void;
}) => {
  return (
    <DragHandleMenu>
      {/*Default button to remove the block.*/}
      <RemoveBlockButton {...props}>Delete</RemoveBlockButton>
      {/*Custom item which opens an alert when clicked.*/}
      <DragHandleMenuItem
        closeMenu={props.closeMenu}
        onClick={() => {
          props.editor.updateBlock(props.block, {
            props: {
              backgroundColor:
                props.block.props.backgroundColor === "gray"
                  ? "default"
                  : "gray",
            },
          });
          props.closeMenu();
        }}
      >
        Invert
      </DragHandleMenuItem>
    </DragHandleMenu>
  );
};
