import { CategoryInfo } from "@/types/category"
import { NextPage } from "next"
import styles from "../styles/category_bar.module.scss"

const CategoryBar: NextPage<{
  categories: CategoryInfo[]
}> = ({ categories }) => {
  return (
    <p>
      {categories.map((category) => {
        return (
          <span className={styles.genre_part} key={category.id}>
            {category.name}
          </span>
        )
      })}
    </p>
  )
}

export default CategoryBar
