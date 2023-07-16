import { z } from "zod";

const base = z.object({
  id: z.string({
    required_error: "id는 필수값입니다.",
  }),
  type: z.enum(
    [
      "heading",
      "paragraph",
      "line",
      "bulletListItem",
      "numberedListItem",
      "singleLine",
      "doubleLine",
    ],
    {
      required_error: "type은 필수값입니다.",
      invalid_type_error: "올바르지 않은 Block 타입입니다.",
    }
  ),
  props: z
    .object({
      textColor: z.literal("default", {
        required_error: "textColor는 필수값입니다.",
        invalid_type_error: "올바르지 않은 textColor입니다.",
      }),
      backgroundColor: z.enum(["default", "gray"], {
        required_error: "backgroundColor는 필수값입니다.",
        invalid_type_error: "올바르지 않은 backgroundColor입니다.",
      }),
      textAlignment: z.enum(["left", "center", "right"], {
        required_error: "textAlignment는 필수값입니다.",
        invalid_type_error: "올바르지 않은 textAlignment입니다.",
      }),
      level: z.enum(["1", "2", "3"], {
        invalid_type_error: "올바르지 않은 level입니다.",
      }),
    })
    .partial()
    .required({
      textColor: true,
      backgroundColor: true,
      textAlignment: true,
    }),
});

export type Base = z.infer<typeof base>;

const styledText = z.object({
  type: z.literal("text", {
    required_error: "type은 필수값입니다.",
    invalid_type_error: "올바르지 않은 Content 타입입니다.",
  }),
  text: z.string({
    required_error: "text는 필수값입니다.",
  }),
  styles: z
    .object(
      {
        underline: z.boolean({
          invalid_type_error: "올바르지 않은 타입입니다.",
        }),
        bold: z.boolean({ invalid_type_error: "올바르지 않은 타입입니다." }),
      },
      {
        required_error: "style은 필수값입니다.",
        invalid_type_error: "올바르지 않은 style입니다.",
      }
    )
    .partial(),
});

export type StyledText = z.infer<typeof styledText>;

const content = z.discriminatedUnion(
  "type",
  [
    styledText,
    z.object({
      type: z.literal("link", {
        required_error: "type은 필수값입니다.",
        invalid_type_error: "올바르지 않은 Content 타입입니다.",
      }),
      content: z.lazy(() => styledText.array()),
    }),
  ],
  {
    required_error: "content는 필수값입니다.",
    invalid_type_error: "올바르지 않은 union입니다.",
  }
);

export type Content = z.infer<typeof content>;

const block: z.ZodType<Block> = base.extend({
  children: z.lazy(() => block.array()),
  content: z.lazy(() => content.array()),
});

export type Block = z.output<typeof base> & {
  children: Block[];
  content: Content[];
};

export const schema = block
  .array()
  .nonempty("최소 1개 이상의 Block이 필요합니다.");

export type Schema = z.infer<typeof schema>;
