export type CommonBaseOutput<T> = {
  success: true,
  result: T
} | {
  success: false
}

export type PostGenreType = {
  id: string
  name: string
  color: string
}

export type PostType = {
  id: string;
  created_at: string;
  last_edited_at: string;
  icon:
    | null
    | {
        isUrl: boolean
        icon: string
      }
  title: string;
  slug: string;
  genres: PostGenreType[];
};