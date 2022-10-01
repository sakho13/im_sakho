import { NextPage } from "next";
import styles from "../styles/link_buttons.module.scss"

const LinkButtons: NextPage = () => {
  const newTab = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button55}
        onClick={() => newTab("https://github.com/sakho13")}
      >
        GitHub
      </button>
      <button
        className={styles.button55}
        onClick={() =>
          newTab("https://www.youtube.com/channel/UCfIemfzMpKiNJHjYatg7MXg")
        }
      >
        YouTube
      </button>
    </div>
  )
}

export default LinkButtons
