import { Blog, BlogInfo } from "@/types/blog"
import cheerio from "cheerio"
import katex from "katex"
import { createClient, GetRequest, MicroCMSListResponse } from "microcms-js-sdk"

export class PostController {
  private microCMS: ReturnType<typeof createClient>

  constructor() {
    this.microCMS = createClient({
      serviceDomain: process.env.SERVICE_DOMAIN ?? "",
      apiKey: process.env.API_KEY ?? "",
    })
  }

  public async getMicroCMSPosts(): Promise<BlogInfo[]> {
    let totalCount = 0
    let limit = 0

    const input: GetRequest = {
      endpoint: "blogs",
      queries: {
        limit: 10,
        orders: "-publishedAt",
        filters:
          process.env.DEVELOP !== undefined && process.env.DEVELOP === "DEVELOP"
            ? undefined // 開発環境
            : "isTest[equals]false", // 実環境
      },
    }

    const res = await this.microCMS.get<MicroCMSListResponse<Blog>>(input)
    totalCount = res.totalCount
    limit = res.limit
    let blogs: BlogInfo[] = [...res.contents]

    while (limit <= totalCount) {
      const res = await this.microCMS.get<MicroCMSListResponse<Blog>>(input)
      totalCount = res.totalCount
      limit = res.limit
      blogs = [...blogs, ...res.contents]
    }

    return blogs
  }

  public async getMicroCMSPost(contentId: string): Promise<BlogInfo | null> {
    try {
      const data = await this.microCMS.get<BlogInfo>({
        endpoint: "blogs",
        contentId: contentId,
        queries: {
          limit: 1,
        },
      })

      const replacedEqHtml = data.content
        .replaceAll(/\$\$[^\$]*\$\$/g, (substring) =>
          katex.renderToString(
            substring
              .replaceAll("$", "")
              .replaceAll(/(<br>|<\\br>|&nbsp;|amp;)/g, ""),
            { strict: "ignore", displayMode: true },
          ),
        )
        .replaceAll(/\$[^\$]*\$/g, (substring) =>
          katex.renderToString(
            substring
              .replaceAll("$", "")
              .replaceAll(/(<br>|<\\br>|&nbsp;|amp;)/g, ""),
            { strict: "ignore", displayMode: false },
          ),
        )

      const cheerioHtml = cheerio.load(replacedEqHtml)

      cheerioHtml(".katex-display").each((_, element) => {
        // cheerioHtml(element).css("height", "50px")
        cheerioHtml(".katex-html").each((_, katexElement) => {
          cheerioHtml(katexElement).css("overflow-x", "auto")
          cheerioHtml(katexElement).css("overflow-y", "clip")
        })

        // cheerioHtml(".tag").each((_, tagElement) => {
        // })
      })

      data.content = cheerioHtml.html()
      return data
    } catch {
      return null
    }
  }
}
