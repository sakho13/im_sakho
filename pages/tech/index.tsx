import type { NextPage } from "next"
import styles from "@/styles/tech_index.module.scss"
import Head from "next/head"
import { motion } from "framer-motion"

const Tech: NextPage = () => {
  const contents: {
    title: string
    paragraph: string[]
  }[] = [
    {
      title: "Next.js",
      paragraph: [],
    },
    {
      title: "TypeScript",
      paragraph: [],
    },
    {
      title: "microCMS",
      paragraph: ["to manage posts"],
    },
    {
      title: "SCSS",
      paragraph: [],
    },
    {
      title: "MaterialUI",
      paragraph: ["to control layouts"],
    },
    {
      title: "Vercel",
      paragraph: ["to deploy"],
    },
    {
      title: "Google Analytics",
      paragraph: [],
    },
  ]

  return (
    <>
      <Head>
        <title>Tech - Sakho&apos;s Portfolios -</title>
      </Head>

      <motion.div
        initial={{ opacity: 0 }} // 初期状態
        animate={{ opacity: 1 }} // マウント時
        exit={{ opacity: 0 }} // アンマウント時
        transition={{
          duration: 0.5,
        }}
      >
        <div className={styles.container}>
          <h1>Usage Techs</h1>

          {contents.map((content) => {
            return (
              <>
                <h2>★ {content.title}</h2>
                {content.paragraph.map((p) => (
                  <p>{p}</p>
                ))}
              </>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}

export default Tech
