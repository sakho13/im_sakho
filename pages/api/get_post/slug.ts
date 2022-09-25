import { NextApiRequest, NextApiResponse } from "next";
import { CommonBaseOutput } from "../api_output_types"

export type GetPostSlugOutput = CommonBaseOutput<{
  postId: string
}>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPostSlugOutput>,
) {
  //
}
