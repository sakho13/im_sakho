import { Blog, BlogInfo } from "@/types/blog"
import cheerio from "cheerio"
import katex from "katex"
import { createClient, GetRequest, MicroCMSListResponse } from "microcms-js-sdk"

export class PostController {
  public microCMS: ReturnType<typeof createClient>

  constructor() {
    // console.log("SD: ", process.env.SERVICE_DOMAIN)
    this.microCMS = createClient({
      serviceDomain: process.env.SERVICE_DOMAIN ?? "",
      apiKey: process.env.API_KEY ?? "",
    })
  }

  public async getMicroCMSPosts(): Promise<BlogInfo[]> {
    // console.log("start")
    let cnt = 0
    const input = (offset: number): GetRequest => {
      return {
        endpoint: "blogs",
        queries: {
          offset,
          limit: 10,
          orders: "-publishedAt",
          filters:
            process.env.DEVELOP !== undefined &&
            process.env.DEVELOP === "DEVELOP"
              ? undefined // 開発環境
              : "isTest[equals]false", // 実環境
        },
      }
    }
    const res = await this.microCMS.get<MicroCMSListResponse<Blog>>(input(cnt))
    const totalCount = res.totalCount

    let blogs: BlogInfo[] = [...res.contents]
    cnt = blogs.length

    while (cnt < totalCount) {
      const res = await this.microCMS.get<MicroCMSListResponse<Blog>>(
        input(cnt),
      )
      blogs = [...blogs, ...res.contents]
      cnt += blogs.length
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
