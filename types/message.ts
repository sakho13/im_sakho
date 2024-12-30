import { MicroCMSListContent } from "microcms-js-sdk/dist/cjs/types"

export type Message = {
  /**
   * min: 2, max: 64
   */
  title: string
  /**
   * min: 2
   */
  comment: string
  blogId: string | null
  /**
   * min: 1, max: 64
   */
  nickName: string
  email?: string
  replay?: string
}

export type MessageObject = Message & MicroCMSListContent

export type GetMessageResponse = {
  comments: MessageObject[]
}

export type PostMessageInput = {
  title: string
  comment: string
  nickName: string
  blogId: string | null
  email: string | null
}

export type PostMessageResponse = {
  message_id: string
}

export type DMLabel = "title" | "nickName" | "email" | "comment"

export type DMType = {
  title: string
  nickName: string
  email: string
  comment: string
}
