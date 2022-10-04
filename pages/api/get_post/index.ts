import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { NextApiRequest, NextApiResponse } from "next"
import NotionPageToHtml from "notion-page-to-html"
import { Content, List, ParagraphBase } from "../../../types/content_type"
import { NotionApi } from "../../../utils/notion_api"
import { CommonBaseOutput } from "../api_output_types"

export type GetPostOutput = CommonBaseOutput<{
  postInfo: PageObjectResponse | PartialPageObjectResponse | null
  html: string
}>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPostOutput>,
) {
  if (req.method === "POST") {
    const slug = req.body.slug as string

    if (slug === undefined || slug === null || slug === "") {
      return res.status(200).json({
        success: true,
        result: {
          postInfo: null,
          html: "",
        },
      })
    }

    const notion = new NotionApi(
      process.env.NOTION_KEY ?? "",
      process.env.NOTION_DB_ID ?? "",
    )

    const post = await notion.getPost(slug)

    const postInfo = post[1] as BlockObjectResponse[]

    const id = post[0]?.id.split("-").join("")
    if (id === undefined) {
      return res.status(200).json({
        success: false,
      })
    }
    const { title, icon, cover, html } = await NotionPageToHtml.convert(
      `https://www.notion.so/${id}`,
      {
        excludeCSS: true,
      },
    )
    // console.log(title)
    // console.log(html)
    const hSliced1 = html
      .split("</html>")[0]
      .split("<html>")[1]
      // .split("</head>")[1]
      .replace("<header>", "<!-- <header>")
      .replace("</header>", "</header> -->")
      .replace("<script>\nMathJax", "<!--<script>\nMathJax")
      .replace('/es5/tex-chtml.js">\n</script>', '/es5/tex-chtml.js">\n</script>-->')
      // .replaceAll("\n", "")

    const hSliced = hSliced1
    console.log(hSliced)

    return res.status(200).json({
      success: true,
      result: {
        postInfo: post[0],
        html: hSliced,
      },
    })
  } else {
    return res.status(404).json({
      success: false,
    })
  }
}

async function convertType2Tag(
  notion: NotionApi,
  pi: BlockObjectResponse
): Promise<Content> {
  if (pi.type === "heading_1") {
    return {
      type: "h1",
      value: pi.heading_1.rich_text.map(richText2Paragraph),
      color: pi.heading_1.color,
    }
  }

  if (pi.type === "heading_2") {
    return {
      type: "h2",
      value: pi.heading_2.rich_text.map(richText2Paragraph),
      color: pi.heading_2.color,
    }
  }

  if (pi.type === "heading_3") {
    return {
      type: "h3",
      value: pi.heading_3.rich_text.map(richText2Paragraph),
      color: pi.heading_3.color,
    }
  }

  if (pi.type === "paragraph") {
    if (pi.has_children) {
      const children = await getBlockChildren(notion, pi.id)
      return {
        type: "p",
        values: pi.paragraph.rich_text.map(richText2Paragraph),
        color: pi.paragraph.color,
        children: children,
      }
    } else {
      return {
        type: "p",
        values: pi.paragraph.rich_text.map(richText2Paragraph),
        color: pi.paragraph.color,
        children: [],
      }
    }
  }

  if (pi.type === "divider") {
    return { type: "divider" }
  }

  if (pi.type === "bulleted_list_item") {
    if (pi.has_children) {
      const c = (await getBlockChildren(notion, pi.id)) as {
        type: "b_list"
        values: List
      }[]
      const cList: List = {
        value: c.map((c1) => c1.values),
        color: "default",
      }

      console.log(cList.value)
      return {
        type: "b_list",
        values: {
          // List
          value: [cList],
          color: pi.bulleted_list_item.color,
        },
      }
    } else {
      return {
        type: "b_list",
        values: {
          // Paragraph
          value: [
            pi.bulleted_list_item.rich_text.map((r) => richText2Paragraph(r)),
          ],
          color: pi.bulleted_list_item.color,
        },
      }
    }
  }

  if (pi.type === "numbered_list_item") {
    if (pi.has_children) {
      const c = (await getBlockChildren(notion, pi.id)) as {
        type: "n_list"
        values: List
      }[]
      const cList: List = {
        value: c.map((c1) => c1.values),
        color: "default",
      }

      return {
        type: "n_list",
        values: {
          value: [{
            value: [
              pi.numbered_list_item.rich_text.map((r) => richText2Paragraph(r))
            ],
            color: pi.numbered_list_item.color
          }, cList],
          color: pi.numbered_list_item.color
        }
      }
    } else {
      return {
        type: "n_list",
        values: {
          value: [
            pi.numbered_list_item.rich_text.map((r) => richText2Paragraph(r)),
          ],
          color: pi.numbered_list_item.color,
        },
      }
    }
  }

  if (pi.type === "equation") {
    return {
      type: "eq",
      value: pi.equation.expression,
    }
  }

  if (pi.type === "code") {
    return {
      type: "code",
      caption: pi.code.caption.map((c) => richText2Paragraph(c)),
      language: pi.code.language,
      values: pi.code.rich_text.map((c) => richText2Paragraph(c))
    }
  }

  if (pi.type === "quote") {
    const children = await getBlockChildren(notion, pi.id)
    if (pi.has_children) {
      return {
        type: "quote",
        values: pi.quote.rich_text.map((r) => richText2Paragraph(r)),
        color: pi.quote.color,
        children: children,
      }
    } else {
      return {
        type: "quote",
        values: pi.quote.rich_text.map((r) => richText2Paragraph(r)),
        color: pi.quote.color,
        children: [],
      }
    }
  }

  return {
    type: "p",
    values: [
      {
        value: `未実装タイプ: ${pi.type}`,
        isEq: false,
        link: null,
        style: {
          bold: true,
          code: false,
          italic: false,
          strikethrough: false,
          underline: false,
          color: "red",
        },
      },
    ],
    color: "default",
    children: [],
  }
}

/**
 * rich_text を pタグ形式に変換
 * @param richText
 * @returns
 */
function richText2Paragraph(richText: RichTextItemResponse): ParagraphBase {
  return {
    value: richText.plain_text,
    isEq: richText.type === "equation",
    link: richText.href,
    style: richText.annotations
  }
}

async function getBlockChildren(notion: NotionApi, blockId: string): Promise<Content[]> {
  const blockChildren = await notion.getBlockChild(blockId)
  const contents: Content[] = []

  for (const c of blockChildren.results) {
    contents.push(await convertType2Tag(notion, c as BlockObjectResponse))
  }
  return contents
}
