import { Grid } from "@mui/material"
// import { Grid } from "@nextui-org/react"
import type { NextPage } from "next"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import styles from "./styles/about_me.module.scss"
import LinkButtons from "./link_buttons"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"

type AboutMeProps = {
  noTitle?: boolean
  noIcon?: boolean
  noLink?: boolean
  noText?: boolean
  noMenu?: boolean
}

type MenuCategory = {
  id: string
  name: string
}

const AboutMe: NextPage<AboutMeProps> = ({
  noTitle = false,
  noIcon = false,
  noLink = false,
  noText = true,
  noMenu = true,
}) => {
  // const isMd = useMediaQuery(960)

  const iconWidth = 150

  const router = useRouter()

  const MenuCategories: (MenuCategory & { subCategories: MenuCategory[] })[] = [
    {
      id: "all",
      name: "全て",
      subCategories: [],
    },
    {
      id: "v_ymg-8af4mp",
      name: "開発",
      subCategories: [],
    },
    {
      id: "ozfqll7ml0dg",
      name: "読書",
      subCategories: [],
    },
    {
      id: "4hq567l-24",
      name: "物理学",
      subCategories: [
        {
          id: "qo0nfq58fay",
          name: "力学",
        },
        // {
        //   id: "yp5d-vwvtnmj",
        //   name: "統計力学",
        // },
        // {
        //   id: "d7gx1akml_s0",
        //   name: "量子力学",
        // },
      ],
    },
    {
      id: "rtqhb6789zut",
      name: "ブログ",
      subCategories: [],
    },
  ]

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
      {!noTitle ? <h1>About Me</h1> : undefined}

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
              objectFit="cover"
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

function useMediaQuery(width: number) {
  const [targetReached, setTargetReached] = useState(false)

  const updateTarget = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true)
    } else {
      setTargetReached(false)
    }
  }, [])
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`)
    media.addListener(updateTarget)

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true)
    }

    return () => media.removeListener(updateTarget)
  }, [])

  return targetReached
}
