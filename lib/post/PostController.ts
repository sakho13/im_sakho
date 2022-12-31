import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { PostType } from "../../pages/api/api_output_types"
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
}
