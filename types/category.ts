import { MicroCMSListContent } from "microcms-js-sdk/dist/cjs/types"

export type Category = {
  name: string
  subCategories: CategoryInfo[]
  isSubCategory: boolean
}

export type MenuCategory = {
  id: string
  name: string
}

export type CategoryInfo = Category & MicroCMSListContent
