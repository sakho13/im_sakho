import { MessageController } from "@/lib/message/MessageController"
import { PostController } from "@/lib/post/PostController"
import { ErrorResponse } from "@/types/error"
import { DMLabel, GetMessageResponse, Message } from "@/types/message"
import { MicroCMSListResponse } from "microcms-js-sdk"
import type { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return res.status(404)

      const postController = new PostController()

      const getParams = req.query

      const page =
        getParams.page &&
        !Array.isArray(getParams.page) &&
        !isNaN(Number(getParams.page))
          ? Number(getParams.page)
          : 0

      const isDM = getParams.dm === "1"

      const blogId = getParams.blog_id

      let filter: string = ``

      if (blogId !== undefined && !Array.isArray(blogId)) {
        // blogId
      }

      const data = await postController.microCMS.get<
        MicroCMSListResponse<Message>
      >({
        endpoint: "messages",
        queries: {
          limit: 10,
          orders: "-publishedAt",
          filters: filter === "" ? undefined : filter,
        },
      })

      const response: GetMessageResponse = {
        comments: data.contents,
      }

      return res.status(200).json(response)

    case "POST": // 投稿
      const messageController = new MessageController()

      // ****************** Validation ******************
      const validator = z.object({
        title: MessageController.checkColumnTitle(),
        comment: MessageController.checkColumnComment(),
        nickName: MessageController.checkColumnNickName(),
        blogId: MessageController.checkColumnBlogId(),
        email: MessageController.checkColumnEmail(),
      })

      const result = validator.safeParse(req.body)
      if (!result.success) {
        const errors = messageController.convZodError2ErrorMessage(result.error)
        const errorResponse: ErrorResponse<DMLabel> = {
          message: "無効な入力です。",
          errors: errors,
        }
        return res.status(400).json(errorResponse)
      }
      // ****************** Validation ******************

      const uploaded = await messageController.uploadMessage(result.data)
      if (!uploaded.success) {
        const errorResponse: ErrorResponse<DMLabel> = {
          message: "投稿に失敗しました。",
          errors: {},
        }
        return res.status(400).json(errorResponse)
      }

      return res.status(200).json({ message_id: uploaded.id })

    default:
      return res.status(404)
  }
}
