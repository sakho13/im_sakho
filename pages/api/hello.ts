import type { NextApiRequest, NextApiResponse } from "next"

type Response = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "Hello" })
  } else {
    return res.status(404)
  }
}
