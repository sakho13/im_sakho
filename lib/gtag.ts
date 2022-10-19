export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ""

// IDが取得できない場合を想定する
export const existsGaId = GA_ID !== ""

/**
 * PVを測定する
 * @param url
 */
export const pageview = (url: string) => {
  // console.log(window.gtag)
  if (!window || !window.gtag) {
    return
  }
  // console.log(url)

  try {
    window.gtag("config", GA_ID, {
      page_path: url,
    })
  } catch (err) {
    // console.warn(err)
  }
}

/**
 * GAイベントを発火させる
 * @param param0
 * @returns
 */
export const event = ({
  action,
  category,
  label,
  value = "",
}: {
  action: string
  category: string
  label: any
  value: any
}) => {
  if (!existsGaId || !window || !window.gtag) {
    return
  }

  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    })
  } catch (err) {
    console.warn(err)
  }
}
