import { ErrorMessage } from "@/types/error"
import { DMLabel, PostMessageInput } from "@/types/message"
import { createClient } from "microcms-js-sdk"
import { z } from "zod"

const endpoint = "messages"

export const MinTitleColumnLen = 2
export const MaxTitleColumnLen = 64

export const MinNickNameColumnLen = 1
export const MaxNickNameColumnLen = 64

export const MinCommentColumnLen = 2

export class MessageController {
  public microCMS: ReturnType<typeof createClient>

  constructor() {
    this.microCMS = createClient({
      serviceDomain: process.env.SERVICE_DOMAIN ?? "",
      apiKey: process.env.API_KEY ?? "",
    })
  }

  /**
   * バリデーションエラーをレスポンス用に修正
   * @param zodError
   * @returns
   */
  public convZodError2ErrorMessage<T>(
    zodError: z.ZodError<T>,
  ): ErrorMessage<DMLabel> {
    const obj: ErrorMessage<DMLabel> = {}

    zodError.errors.forEach((error) => {
      console.log(error)
      switch (error.path[0]) {
        case "title": {
          if (error.code === "too_small") {
          }
          break
        }
        case "nickName": {
          break
        }
        case "comment": {
          break
        }
        case "email": {
          break
        }

        default:
          break
      }
    })

    return obj
  }

  /**
   * バリデーション済みのメッセージを投稿
   * @param message
   * @returns
   */
  public async uploadMessage(
    message: PostMessageInput,
  ): Promise<{ success: true; id: string } | { success: false }> {
    try {
      if (message.blogId === null) {
        // DM
        const res = await this.microCMS.create({
          endpoint,
          content: {
            title: message.title,
            comment: message.comment,
            nickName: message.nickName,
            email: message.email ?? "",
          },
        })

        if (message.email) {
          //
        }

        return {
          success: true,
          id: res.id,
        }
      } else {
        //
      }
      return {
        success: true,
        id: "",
      }
    } catch (err: any) {
      console.log(err.message)
      return {
        success: false,
      }
    }
  }

  // ********************** バリデーション **********************

  public static checkValue(label: DMLabel, value: unknown): string | undefined {
    switch (label) {
      case "title": {
        const result = MessageController.checkColumnTitle().safeParse(value)
        if (!result.success && result.error.errors[0]) {
          if (result.error.errors[0].code === "too_small") {
            return `${MinTitleColumnLen}文字以上のタイトルでお願いします。`
          }
          if (result.error.errors[0].code === "too_big") {
            return `${MaxTitleColumnLen}文字以下のタイトルでお願いします。`
          }
        } else {
          return undefined
        }
        break
      }

      case "nickName": {
        const result = MessageController.checkColumnNickName().safeParse(value)

        if (!result.success && result.error.errors[0]) {
          if (result.error.errors[0].code === "too_small") {
            return `${MinNickNameColumnLen}文字以上のニックネームでお願いします。`
          }
          if (result.error.errors[0].code === "too_big") {
            return `${MaxNickNameColumnLen}文字以下のニックネームでお願いします。`
          }
        } else {
          return undefined
        }
        break
      }

      case "email": {
        const result = MessageController.checkColumnEmail().safeParse(value)

        if (!result.success && result.error.errors[0]) {
          console.log(result.error.errors[0])
          if (result.error.errors[0].code === "invalid_string") {
            return "メールアドレスのフォーマットでお願いします。"
          }
        } else {
          return undefined
        }
        break
      }

      case "comment": {
        const result = MessageController.checkColumnComment().safeParse(value)

        if (!result.success && result.error.errors[0]) {
          if (result.error.errors[0].code === "too_small") {
            return `${MinCommentColumnLen}文字以上のコメントでお願いします。`
          }
        } else {
          return undefined
        }
        break
      }

      default:
        return undefined
    }
  }

  public static checkColumnTitle() {
    return z.string().min(MinTitleColumnLen).max(MaxTitleColumnLen)
  }

  public static checkColumnNickName() {
    return z.string().min(1).max(64)
  }

  public static checkColumnComment() {
    return z.string().min(MinCommentColumnLen)
  }

  public static checkColumnEmail() {
    return z.string().email().nullable()
  }

  public static checkColumnBlogId() {
    return z.string().nullable()
  }
  // ********************** バリデーション **********************
}
