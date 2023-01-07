import { Client } from "@notionhq/client"
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

export class NotionApi {
  private notion: Client
  private dbId: string

  constructor(notionKey: string, notionDbId: string) {
    // console.log("nApi: ", notionKey, notionDbId)
    this.notion = new Client({
      auth: notionKey,
    })
    this.dbId = notionDbId
  }

  /**
   * 投稿したコンテンツを取得
   * @param nextCursor
   * @returns
   */
  public async getPosts(nextCursor: null | string) {
    const res = await this.notion.databases.query({
      database_id: this.dbId,
      filter: {
        and: [
          // {
          //   property: "Published",
          //   checkbox: {
          //     equals: true,
          //   },
          // },
          {
            property: "Test",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Slug",
            rich_text: {
              is_not_empty: true,
            },
          },
        ],
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
      start_cursor: nextCursor === null ? undefined : nextCursor,
      page_size: 20,
    })
    return res
  }

  /**
   * 特定コンテンツを取得
   * @param slug
   * @returns
   */
  public async getPost(
    slug: string,
  ): Promise<[PageObjectResponse | PartialPageObjectResponse | null, any[]]> {
    // console.log(slug)
    const res1 = await this.notion.databases.query({
      database_id: this.dbId,
      filter: {
        and: [
          // {
          //   property: "Published",
          //   checkbox: {
          //     equals: true,
          //   },
          // },
          {
            property: "Test",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
      page_size: 1,
    })

    if (res1.results.length === 1 && "url" in res1.results[0]) {
      const page_id = res1.results[0].id
      const res2 = await this.notion.blocks.children.list({
        block_id: page_id,
      })
      return [res1.results[0], res2.results]
    }

    return [null, []]
  }

  public async getBlockChild(blockId: string) {
    return await this.notion.blocks.children.list({ block_id: blockId })
  }
}
