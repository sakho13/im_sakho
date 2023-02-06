import { MenuCategory } from "@/types/category"

export const MenuCategories: (MenuCategory & {
  subCategories: MenuCategory[]
})[] = [
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
    id: "qzk7dljhfu",
    name: "動画",
    subCategories: [],
  },
  {
    id: "kintore",
    name: "筋トレ",
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
