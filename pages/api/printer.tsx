// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Block, StyledText } from "@blocknote/core";
import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "node:net";
import {
  render,
  Printer,
  Text,
  Br,
  Line,
  Cut,
  TextSize,
} from "react-thermal-printer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const conn = connect({
    host: process.env.PRINTER_HOST ?? "192.168.0.3",
    port: Number(process.env.PRINTER_PORT ?? 9100),
    timeout: 3000,
  });

  if (conn.errored) {
    res.status(500).json({ success: false, error: conn.errored });
    return;
  }

  const data = await render(
    <Printer width={42} type={"epson"} characterSet="korea">
      {(req.body as Block<any>[]).map(({ type, content, props }) => {
        console.log(type, content, props);

        if (type === "heading")
          return (
            <Text
              invert={props.backgroundColor === "default" ? true : undefined}
              bold={(content[0] as StyledText)?.styles?.["bold"] ? true : false}
              underline={
                (content[0] as StyledText)?.styles?.["underline"]
                  ? "1dot-thick"
                  : "none"
              }
              align={props.textAlignment ?? "left"}
              size={{
                width: (4 - Number(props.level)) as TextSize,
                height: (4 - Number(props.level)) as TextSize,
              }}
            >
              {(content[0] as StyledText).text}
            </Text>
          );
        if (type === "paragraph" && !content.length) return <Br {...props} />;
        if (type === "paragraph")
          return (
            <Text
              invert={props.backgroundColor === "gray" ? true : undefined}
              bold={(content[0] as StyledText)?.styles?.["bold"] ? true : false}
              underline={
                (content[0] as StyledText)?.styles?.["underline"]
                  ? "1dot-thick"
                  : "none"
              }
              align={props.textAlignment ?? "left"}
            >
              {(content[0] as StyledText)?.text}
            </Text>
          );
        if (type === "line") return <Line {...props} />;
      })}
      <Cut />
    </Printer>
  );

  await new Promise<void>((resolve) => {
    conn.write(data, () => {
      conn.destroy();
      resolve();
    });
  });

  res.status(200).json({ success: true });
}
