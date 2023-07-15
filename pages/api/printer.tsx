// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Block, BlockSchema } from "@blocknote/core";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  breakLine,
} from "node-thermal-printer";

export default async function handler<BSchema extends BlockSchema>(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${process.env.PRINTER_HOTS}:${process.env.PRINTER_PORT}`,
    characterSet: CharacterSet.KOREA,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    options: {
      timeout: 3000,
    },
  });

  // const isConnected = await printer.isPrinterConnected();

  // if (!isConnected)
  //   return res.status(500).json({
  //     error: true,
  //     message: "프린터가 연결되어 있지 않습니다.",
  //   });

  function renderBlock(block: Block<BSchema>, depth = 0) {
    // handle max depth
    if (depth > 5)
      return res.status(400).json({
        error: true,
        message: "max depth exceeded",
      });

    // render heading
    if (block.type === "heading") {
      const { level } = block.props;
      const size = 4 - Number(level);
      printer.setTextSize(size, size);
    }

    // render paragraph
    if (block.type === "paragraph") {
      printer.setTextSize(1, 1);
    }

    // render props
    Object.entries(block.props).forEach(([key, value]) => {
      // Align
      if (key === "textAlignment") {
        switch (value) {
          case "left":
            return printer.alignLeft();
          case "center":
            return printer.alignCenter();
          case "right":
            return printer.alignRight();
        }
      }

      // Invert
      if (key === "backgroundColor") {
        if (value === "gray") {
          printer.invert(true);
        }
        return;
      }

      // ignore props
      if (key === "level") return;
      if (key === "textColor") return;

      res.status(400).json({
        error: true,
        message: "invalid prop",
        prop: {
          [key]: value,
        },
      });
    });

    // render contents
    if (block.content.length > 0) {
      renderContent(block.content, depth);
    }

    // render children
    if (block.children.length > 0) {
      block.children.forEach((child) => {
        renderBlock(child, depth + 1);
      });
    }
  }

  function renderContent(content: Block<BSchema>["content"], depth = 0) {
    if (!content.length) return;

    content.forEach((content) => {
      if (content.type === "text") {
        const { text } = content;

        Object.entries(content.styles).forEach(([key, value]) => {
          // Bold
          if (key === "bold") {
            console.debug("styles: bold");
            if (value === true) printer.bold(true);
            return;
          }
          // Underline
          if (key === "underline") {
            console.debug("styles: underline");
            if (value === true) printer.underline(true);
            return;
          }

          res.status(400).json({
            error: true,
            message: "unhandled style",
            style: {
              [key]: value,
            },
          });
        });

        return printer.println(String().padStart(depth * 2, " ") + text);
      }

      if (content.type === "link") {
        return renderContent(content.content);
      }

      return res.status(400).json({
        error: true,
        message: "invalid content type",
        content: content,
      });
    });
  }

  req.body.forEach((item: Block<BSchema>) => renderBlock(item));

  printer.cut();
  await printer.execute();

  res.status(200).end({
    success: true,
  });
}
