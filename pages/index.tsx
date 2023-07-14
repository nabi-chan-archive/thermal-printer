import { useState } from "react";
import { produce } from "immer";
import axios from "axios";

const types: {
  [key: string]: {
    title: string;
    props: {
      [key: string]:
        | {
            type: "select";
            value: string[];
            props?: any;
          }
        | {
            type: string;
            props?: any;
          };
    };
  };
} = {
  text: {
    title: "Text",
    props: {
      align: {
        type: "select",
        value: ["left", "center", "right"],
      },
      bold: {
        type: "boolean",
      },
      font: {
        type: "select",
        value: ["A", "B", "C", "D", "E", "special-A", "special-B"],
      },
      underline: {
        type: "select",
        value: ["none", "1dot-thick", "2dot-thick"],
      },
      invert: {
        type: "boolean",
      },
      width: {
        type: "input",
        props: {
          defaultValue: "1",
        },
      },
      height: {
        type: "input",
        props: {
          defaultValue: "1",
        },
      },
      children: {
        type: "textarea",
      },
    },
  },
  row: {
    title: "Row",
    props: {
      left: {
        type: "input",
      },
      right: {
        type: "input",
      },
      gap: {
        type: "input",
        props: {
          defaultValue: "0",
        },
      },
    },
  },
  br: {
    title: "Br",
    props: {},
  },
  line: {
    title: "Line",
    props: {
      character: {
        type: "input",
        props: {
          defaultValue: "-",
        },
      },
    },
  },
  barcode: {
    title: "Barcode",
    props: {
      type: {
        type: "select",
        value: [
          "UPC-A",
          "UPC-E",
          "JAN13",
          "JAN8",
          "CODE39",
          "ITF",
          "CODABAR",
          "CODE93",
          "CODE128",
          "GS1-128",
          "GS1 (DataBar Omnidirectional)",
          "GS1 (DataBar Truncated)",
          "GS1 (DataBar Limited)",
          "GS1 (DataBar Expanded)",
        ],
      },
      align: {
        type: "select",
        value: ["left", "center", "right"],
      },
      content: {
        type: "input",
      },
      width: {
        type: "select",
        value: ["1", "2", "3", "4", "5"],
      },
      height: {
        type: "input",
      },
      hriPosition: {
        type: "select",
        value: ["none", "top", "bottom", "top-bottom"],
      },
      hriFont: {
        type: "select",
        value: ["A", "B", "C", "D", "E", "special-A", "special-B"],
      },
    },
  },
  qrcode: {
    title: "QRCode",
    props: {
      model: {
        type: "select",
        value: ["model1", "model2", "model3"],
      },
      cellSize: {
        type: "select",
        value: ["1", "2", "3", "4", "5", "6", "7", "8"],
      },
      correction: {
        type: "select",
        value: ["L", "M", "Q", "H"],
      },
      align: {
        type: "select",
        value: ["left", "center", "right"],
      },
      content: {
        type: "input",
      },
    },
  },
  image: {
    title: "Image",
    props: {
      align: {
        type: "select",
        value: ["left", "center", "right"],
      },
      src: {
        type: "input",
      },
    },
  },
};

export default function Home() {
  const [contents, setContents] = useState<{ type: string; props: any }[]>([]);
  const [type, setType] = useState<keyof typeof types>("text");

  async function submit() {
    axios.post("/api/printer", contents);
  }

  return (
    <main className="p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4">Next.js + Thermal Printer</h1>

      <div className="grid gap-2">
        {contents.map(({ type }, index) => {
          return (
            <div key={index} className="border-b-2 pb-2 grid gap-2">
              <b>{types[type as keyof typeof types].title}</b>
              {Object.entries(types[type as keyof typeof types].props).map(
                ([key, item]) => (
                  <div
                    key={key}
                    className="grid gap-4 items-center"
                    style={{
                      gridTemplateColumns: "1fr 3fr",
                    }}
                  >
                    {item.type === "select" ? (
                      <>
                        <span>{key}</span>
                        <select
                          {...item.props}
                          onChange={(e) =>
                            setContents((prev) =>
                              produce(prev, (draft) => {
                                draft[index].props[key] = e.target.value;
                              })
                            )
                          }
                          className="select select-bordered select-sm"
                        >
                          {(
                            item as { type: "select"; value: string[] }
                          ).value.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : item.type === "boolean" ? (
                      <>
                        <span>{key}</span>
                        <label className="cursor-pointer label">
                          <input
                            {...item.props}
                            onChange={(e) =>
                              setContents((prev) =>
                                produce(prev, (draft) => {
                                  if (e.target.checked)
                                    draft[index].props[key] = true;
                                  else delete draft[index].props[key];
                                })
                              )
                            }
                            type="checkbox"
                            className="checkbox"
                          />
                        </label>
                      </>
                    ) : item.type === "input" ? (
                      <>
                        <span>{key}</span>
                        <input
                          {...item.props}
                          type="text"
                          className="input input-bordered input-sm"
                          onChange={(e) =>
                            setContents((prev) =>
                              produce(prev, (draft) => {
                                draft[index].props[key] = e.target.value;
                              })
                            )
                          }
                        />
                      </>
                    ) : item.type === "textarea" ? (
                      <>
                        <span>{key}</span>
                        <textarea
                          {...item.props}
                          className="textarea textarea-bordered textarea-sm"
                          onChange={(e) =>
                            setContents((prev) =>
                              produce(prev, (draft) => {
                                draft[index].props[key] = e.target.value;
                              })
                            )
                          }
                        />
                      </>
                    ) : null}
                  </div>
                )
              )}
              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setContents((prev) =>
                      produce(prev, (draft) => {
                        draft.splice(index, 1);
                      })
                    )
                  }
                  className="btn btn-sm btn-error"
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <div className="flex gap-4">
          <select
            onChange={(e) => setType(e.target.value)}
            className="select select-bordered select-sm"
          >
            {Object.keys(types).map((type, index) => (
              <option key={index} value={type}>
                {types[type as keyof typeof types].title}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              setContents((prev) =>
                produce(prev, (draft) => {
                  draft.push({ type: String(type), props: {} });
                })
              )
            }
            className="btn btn-sm"
          >
            추가하기
          </button>
        </div>
        <button className="btn btn-sm" onClick={submit}>
          전송하기
        </button>
      </div>
    </main>
  );
}
