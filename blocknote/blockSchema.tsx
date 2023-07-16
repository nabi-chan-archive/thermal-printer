import { createReactBlockSpec } from "@blocknote/react";

export const customBlockSchema = {
  singleLine: createReactBlockSpec({
    type: "singleLine" as const,
    propSchema: {
      textColor: {
        default: "default",
      },
      backgroundColor: {
        default: "default",
      },
      textAlignment: {
        default: "left",
      },
    },
    containsInlineContent: false,
    render(props) {
      return (
        <hr
          style={{
            height: 2,
            boxSizing: "content-box",
            borderTop: "2px dashed black",
          }}
        />
      );
    },
  }),
  doubleLine: createReactBlockSpec({
    type: "doubleLine" as const,
    propSchema: {
      textColor: {
        default: "default",
      },
      backgroundColor: {
        default: "default",
      },
      textAlignment: {
        default: "left",
      },
    },
    containsInlineContent: false,
    render(props) {
      return (
        <hr
          style={{
            height: 2,
            boxSizing: "content-box",
            borderTop: "2px dashed black",
            borderBottom: "2px dashed black",
          }}
        />
      );
    },
  }),
};
