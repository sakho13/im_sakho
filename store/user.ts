import { atom } from "recoil"


const supportLangIds = ["ja", "en"] as const

type SupportLangIds = typeof supportLangIds[number]

export const supportLang: {
  id: SupportLangIds;
  name: string;
}[] = [
  { id: "ja", name: "Japanese" },
  { id: "en", name: "English" },
];

type UserState = {
  langType: SupportLangIds
}

export const userState = atom<UserState>({
  key: "user",

  default: {
    langType: "ja",
  },
});