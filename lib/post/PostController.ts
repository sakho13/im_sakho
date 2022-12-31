import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import NotionPageToHtml from "notion-page-to-html"
import { PostDetailType, PostType } from "../../pages/api/api_output_types"
import { NotionApi } from "../../utils/notion_api"

export class PostController {
  public async getPosts(): Promise<PostType[]> {
    const resPosts: PostType[] = []
    let nextCursor: string | null = null

    const notion = new NotionApi(
      process.env.NOTION_KEY ?? "",
      process.env.NOTION_DB_ID ?? "",
    )

    do {
      const posts: QueryDatabaseResponse = await notion.getPosts(nextCursor)
      nextCursor = posts.next_cursor

      if (
        posts.object === "list" &&
        posts.results.length > 0 &&
        "properties" in posts.results[0]
      ) {
        // console.log("nc: ", posts.next_cursor, posts.has_more)
        posts.results.forEach(async (post) => {
          // console.log(post)
          if ("properties" in post) {
            const page = post.properties.Page as {
              id: "title"
              type: "title"
              title: any[]
            }
            const slug: any = post.properties.Slug
            const genre: any = post.properties.Genre
            const icon =
              post.icon?.type === "emoji"
                ? {
                    isUrl: false,
                    icon: post.icon.emoji,
                  }
                : post.icon?.type === "external"
                ? {
                    isUrl: true,
                    icon: post.icon.external.url,
                  }
                : null
            const genres: any[] = genre.multi_select.map((g: any) => {
              return {
                id: g.id,
                name: g.name,
                color: g.color,
              }
            })

            if (genres.length === 0) {
              genres.push({
                id: "unknown",
                name: "未分類",
                color: "",
              })
            }

            const newPost: PostType = {
              id: post.id,
              title: page.title[0].plain_text,
              slug: slug.rich_text[0].plain_text,
              created_at: post.created_time,
              last_edited_at: post.last_edited_time,
              icon: icon,
              genres: genres,
            }

            resPosts.push(newPost)
          }
        })
      }
    } while (nextCursor !== null)

    return resPosts
  }

  public async getPost(slug: string): Promise<PostDetailType> {
    if (slug === undefined || slug === null || slug === "") {
      return {
        postInfo: null,
        html: "",
      }
    }

    const notion = new NotionApi(
      process.env.NOTION_KEY ?? "",
      process.env.NOTION_DB_ID ?? "",
    )

    const post = await notion.getPost(slug)

    // const postInfo = post[1] as BlockObjectResponse[]

    const id = post[0]?.id.split("-").join("")
    if (id === undefined) {
      return {
        postInfo: null,
        html: "",
      }
    }
    const { title, icon, cover, html } = await NotionPageToHtml.convert(
      `https://www.notion.so/${id}`,
      {
        excludeCSS: true,
        excludeTitleFromHead: true,
        excludeMetadata: true,
        excludeHeaderFromBody: true,
        bodyContentOnly: false,
        excludeScripts: false,
      },
    )
    // console.log(title)
    // console.log(html)
    const hSliced1 = html
    // .split("</html>")[0]
    // .split("<html>")[1]
    // .split("</head>")[1]
    // .replace("<header>", "<!-- <header>")
    // .replace("</header>", "</header> -->")
    // .replace("<script>\nMathJax", "<!--<script>\nMathJax")
    // .replace(
    //   '/es5/tex-chtml.js">\n</script>',
    //   '/es5/tex-chtml.js">\n</script>-->',
    // )
    // .replaceAll("\n", "")

    const hSliced = hSliced1

    return {
      postInfo: post[0],
      html: hSliced,
    }
  }
}
