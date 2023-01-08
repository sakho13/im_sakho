import type { NextPage } from "next"
import styles from "@/styles/tech_index.module.scss"

const Tech: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Usage Techs</h1>

      <h2>★ Next.js</h2>

      <h2>★ TypeScript</h2>

      <h2>★ microCMS</h2>

      <p>to manage posts</p>

      <h2>★ SCSS</h2>

      <h2>★ MaterialUI</h2>

      <p>to control layouts</p>

      <h2>★ Vercel</h2>

      <p>to deploy</p>

      <h2>☆ Google Analytics</h2>
    </div>
  )
}

export default Tech
