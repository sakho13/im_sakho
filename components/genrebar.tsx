import { NextPage } from "next";
import styles from "./styles/genrebar.module.scss"

const Genrebar: NextPage<{
  genres: {
    id: string
    name: string
  }[]
}> = ({ genres }) => {
  return (
    <p>
      {genres.map((genre) => {
        return (
          <span className={styles.genre_part} key={genre.id}>
            {genre.name}
          </span>
        )
      })}
    </p>
  )
}

export default Genrebar
