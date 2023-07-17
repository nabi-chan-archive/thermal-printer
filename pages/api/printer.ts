// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { schema, Block, Content } from "@/schema/printer";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from "node-thermal-printer";
import { z } from "zod";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({
      error: true,
      message: "허용되지 않는 메소드입니다.",
    });

  const result = z
    .object({
      title: z.string({
        required_error: "title은 필수값입니다.",
      }),
      printsTitle: z.boolean(),
      blocks: schema,
    })
    .safeParse(req.body);

  if (!result.success)
    return res.status(400).json({
      error: true,
      message: "요청값이 올바르지 않습니다.",
      errors: result.error,
    });

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${process.env.PRINTER_HOST}:${process.env.PRINTER_PORT}`,
    characterSet: CharacterSet.KOREA,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    width: 42,
    options: {
      timeout: 3000,
    },
  });

  const isConnected = await printer.isPrinterConnected();

  if (!isConnected)
    return res.status(500).json({
      error: true,
      message: "프린터가 연결되어 있지 않습니다.",
    });

  let numberedListItemIndex = {
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
  };

  function renderBlock(block: Block, depth = 0) {
    // reset style
    printer.setTextNormal();
    printer.invert(false);

    // add depth
    printer.print(String().padStart(depth * 2, " "));

    // render heading
    if (block.type === "heading") {
      const { level } = block.props;
      const size = 4 - Number(level);
      printer.setTextSize(size, size);
    }

    // render bulletListItem
    if (block.type === "bulletListItem") {
      printer.print("* ");
    }

    // render numberedListItem
    if (block.type === "numberedListItem") {
      printer.print(
        numberedListItemIndex[depth as keyof typeof numberedListItemIndex] +
          ". "
      );
      numberedListItemIndex[depth as keyof typeof numberedListItemIndex]++;
    } else {
      numberedListItemIndex[depth as keyof typeof numberedListItemIndex] = 1;
    }

    if (block.type === "singleLine") {
      printer.println(Array(42).fill("-").join(""));
    }

    if (block.type === "doubleLine") {
      printer.println(Array(42).fill("=").join(""));
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
      renderContent(block.content);
    }

    // render children
    if (block.children.length > 0) {
      block.children.forEach((child) => {
        renderBlock(child, depth + 1);
      });
    }
  }

  function renderContent(content: Content[]) {
    if (!content.length) return;

    content.forEach((content) => {
      if (content.type === "text") {
        const { text } = content;

        Object.entries(content.styles).forEach(([key, value]) => {
          // Bold
          if (key === "bold") {
            if (value === true) printer.bold(true);
            return;
          }
          // Underline
          if (key === "underline") {
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

        return printer.println(text);
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

  if (result.data.printsTitle) {
    renderBlock({
      id: "title",
      type: "heading",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
        level: "3",
      },
      children: [],
      content: [
        {
          type: "text",
          text: result.data.title,
          styles: {},
        },
      ],
    });

    renderBlock({
      id: "paragraph",
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
      },
      children: [],
      content: [
        {
          type: "text",
          text: dayjs().tz("Asia/Seoul").format("YYYY년 MM월 DD일 HH시 mm분"),
          styles: {
            bold: true,
          },
        },
      ],
    });

    renderBlock({
      id: "doubleLine",
      type: "doubleLine",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
      },
      children: [],
      content: [],
    });
  }

  result.data.blocks.forEach((item) => renderBlock(item));

  printer.cut();
  await printer.execute();

  res.status(200).json({
    success: true,
  });
}
