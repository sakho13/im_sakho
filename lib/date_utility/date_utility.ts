import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 *  ISO 8601形式の日付の変換
 * @param raw ISO 8601形式の日付
 * @returns Asia/Tokyoでの年月日
 */
export function convDate(raw: string | undefined): string {
  if (raw === undefined) {
    return "9999年12年31日"
  }

  return dayjs.utc(raw).tz("Asia/Tokyo").format("YYYY年MM月DD日")
}
