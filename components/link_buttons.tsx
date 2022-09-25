import { Button } from "@nextui-org/react";
import { NextPage } from "next";

const LinkButtons: NextPage = () => {
  const newTab = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <Button.Group>
      <Button
        auto
        ghost
        flat
        onClick={() => newTab("https://github.com/sakho13")}
      >
        GitHub
      </Button>
      <Button
        auto
        ghost
        flat
        onClick={() => newTab("https://www.youtube.com/channel/UCfIemfzMpKiNJHjYatg7MXg")}
      >
        YouTube
      </Button>
    </Button.Group>
  )
}

export default LinkButtons
