// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "node:net";
import {
  render,
  Printer,
  Text,
  Row,
  Br,
  Line,
  Barcode,
  QRCode,
  Image,
  Cut,
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
      {(req.body as { type: string; props: any }[]).map(({ type, props }) => {
        if (type === "text")
          return (
            <Text
              {...props}
              size={{
                width: props.width ?? "1",
                height: props.height ?? "1",
              }}
            />
          );
        if (type === "row") return <Row {...props} />;
        if (type === "br") return <Br {...props} />;
        if (type === "line") return <Line {...props} />;
        if (type === "barcode") return <Barcode {...props} />;
        if (type === "qrcode") return <QRCode {...props} />;
        if (type === "image") return <Image {...props} alt="" />;
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
