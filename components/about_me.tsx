import { Grid } from "@mui/material"
import type { NextPage } from "next"
import Image from "next/image"
import { useState } from "react"
import styles from "./styles/about_me.module.scss"
import LinkButtons from "./link_buttons"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { MenuCategories } from "@/statics/menu_categories"

type AboutMeProps = {
  noTitle?: boolean
  noIcon?: boolean
  noLink?: boolean
  noText?: boolean
  noMenu?: boolean
}

const AboutMe: NextPage<AboutMeProps> = ({
  noTitle = false,
  noIcon = false,
  noLink = false,
  noText = true,
  noMenu = true,
}) => {
  const iconWidth = 150

  const router = useRouter()

  const [openingCategory, setOpeningCategory] = useState<string | null>(null)
  const toggleCategory = (id: string) => {
    if (openingCategory === id) {
      setOpeningCategory(null)
    } else {
      setOpeningCategory(id)
    }
  }

  return (
    <div className={styles.container}>
      {!noTitle ? <h1>Profile</h1> : undefined}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {!noIcon ? (
          <Grid item sx={{ marginBottom: "20px" }}>
            <Image
              src="/my_icon.png"
              alt="my_icon"
              className={styles.img_cover}
              width={iconWidth}
              height={iconWidth}
            />
          </Grid>
        ) : undefined}

        {!noLink ? (
          <Grid item>
            <LinkButtons />
          </Grid>
        ) : undefined}

        {!noText ? (
          <Grid item sx={{ marginTop: "20px" }}>
            <Typography variant="body1">
              電子情報系高専卒 / 物理学大学生です。
            </Typography>
          </Grid>
        ) : undefined}

        {!noMenu ? (
          <div className={styles.menu}>
            <p className={styles.menu_title}>Categories</p>

            {MenuCategories.map((category) => {
              return (
                <div key={category.id} className={styles.menu_item}>
                  <div className={styles.menu_item_item}>
                    <div
                      className={styles.menu_item_item_label}
                      onClick={() => {
                        router.push({
                          pathname: "/post",
                          query: { category: category.id },
                        })
                      }}
                    >
                      {category.name}
                    </div>
                    <div className={styles.menu_item_item_more}>
                      {category.subCategories.length > 0 ? (
                        <div
                          onClick={() => {
                            toggleCategory(category.id)
                          }}
                        >
                          O
                        </div>
                      ) : undefined}
                    </div>
                  </div>

                  {category.subCategories.length > 0 ? (
                    <div
                      className={styles.menu_item_collapse}
                      style={{
                        display:
                          openingCategory === category.id ? "block" : "none",
                      }}
                    >
                      {category.subCategories.map((subCategory) => {
                        return (
                          <div
                            key={subCategory.id}
                            className={styles.menu_item_collapse_label}
                            onClick={() => {
                              router.push({
                                pathname: "/post",
                                query: {
                                  category: category.id,
                                  sub_category: subCategory.id,
                                },
                              })
                            }}
                          >
                            {subCategory.name}
                          </div>
                        )
                      })}
                    </div>
                  ) : undefined}
                </div>
              )
            })}
          </div>
        ) : undefined}
      </Grid>
    </div>
  )
}

export default AboutMe
