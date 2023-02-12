import type { NextPage } from "next"
import styles from "@/styles/contact_index.module.scss"
import { useRouter } from "next/router"
import Head from "next/head"
import { motion } from "framer-motion"
import { ChangeEvent, useState } from "react"
import { MessageController } from "@/lib/message/MessageController"
import {
  DMLabel,
  DMType,
  PostMessageInput,
  PostMessageResponse,
} from "@/types/message"
import axios, { AxiosResponse } from "axios"

export type ContactProps = {}

const Contact: NextPage<ContactProps> = ({}: ContactProps) => {
  const router = useRouter()

  const [dm, setDM] = useState<DMType>({
    title: "",
    nickName: "",
    email: "",
    comment: "",
  })

  const [dmError, setDMError] = useState<Partial<DMType>>({})

  const resetDM = () => {
    setDM({
      title: "",
      nickName: "",
      email: "",
      comment: "",
    })
  }

  const inputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: DMLabel,
  ) => {
    const value = event.target.value
    switch (label) {
      case "title": {
        setDM({ ...dm, title: value })

        setDMError({
          ...dmError,
          title: MessageController.checkValue("title", value),
        })
        break
      }
      case "nickName": {
        setDM({ ...dm, nickName: value })

        setDMError({
          ...dmError,
          nickName: MessageController.checkValue("nickName", value),
        })
        break
      }
      case "email": {
        setDM({ ...dm, email: value })

        setDMError({
          ...dmError,
          email: MessageController.checkValue("email", value),
        })
        break
      }
      case "comment": {
        setDM({ ...dm, comment: value })

        setDMError({
          ...dmError,
          comment: MessageController.checkValue("comment", value),
        })
        break
      }
    }
  }

  const uploadMessage = async () => {
    setDMError({
      title: MessageController.checkValue("title", dm.title),
      nickName: MessageController.checkValue("nickName", dm.nickName),
      comment: MessageController.checkValue("comment", dm.comment),
      email: MessageController.checkValue("email", dm.email),
    })

    Object.entries(dmError).forEach((error) => {
      console.log(error[1])
    })

    const input: PostMessageInput = {
      title: dm.title,
      nickName: dm.nickName,
      comment: dm.comment,
      email: dm.email,
      blogId: null,
    }

    const res = await axios.post<
      PostMessageInput,
      AxiosResponse<PostMessageResponse>
    >("/api/message", input)

    if (res.status === 200) {
      resetDM()

      alert(
        "受け取りました。\n確認次第、入力頂いたメールアドレスに返信いたします。",
      )
    } else {
      alert("failed to send")
    }
  }

  return (
    <>
      <Head>
        <title>Contact - Sakho&apos;s Portfolios -</title>
      </Head>

      <motion.div
        initial={{ opacity: 0 }} // 初期状態
        animate={{ opacity: 1 }} // マウント時
        exit={{ opacity: 0 }} // アンマウント時
        transition={{
          duration: 0.5,
        }}
      >
        <h1 className={styles.dm_title}>Direct Message</h1>

        <div className={styles.dm_form}>
          <div className={styles.dm_form_cell}>
            <p className={styles.dm_form_cell_title}>Title</p>
            <input
              type={"text"}
              value={dm.title}
              onChange={(ev) => {
                inputChange(ev, "title")
              }}
            />
            <p className={styles.dm_form_cell_error}>{dmError.title}</p>
          </div>

          <div className={styles.dm_form_cell}>
            <p className={styles.dm_form_cell_title}>Nick Name</p>
            <input
              type={"text"}
              value={dm.nickName}
              onChange={(ev) => {
                inputChange(ev, "nickName")
              }}
            />
            <p className={styles.dm_form_cell_error}>{dmError.nickName}</p>
          </div>

          <div className={styles.dm_form_cell}>
            <p className={styles.dm_form_cell_title}>Email</p>
            <input
              type={"email"}
              value={dm.email}
              onChange={(ev) => {
                inputChange(ev, "email")
              }}
              placeholder="Your Email Address"
            />
            <p className={styles.dm_form_cell_error}>{dmError.email}</p>
          </div>

          <div className={styles.dm_form_cell}>
            <p className={styles.dm_form_cell_title}>Comment</p>
            <textarea
              rows={5}
              value={dm.comment}
              onChange={(ev) => {
                inputChange(ev, "comment")
              }}
            />
            <p className={styles.dm_form_cell_error}>{dmError.comment}</p>
          </div>

          <div className={styles.dm_form_cell_button}>
            <button
              onClick={() => {
                uploadMessage()
              }}
            >
              send
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Contact
