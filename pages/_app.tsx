import "../styles/globals.scss"
import styles from "../styles/globals.module.scss"
import type { AppProps } from "next/app"
import Head from "next/head"
import Layout from "../components/layout"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { GA_ID, pageview } from "../lib/gtag"
import Script from "next/script"
import { usePageView } from "@/hooks/usePageView"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  usePageView()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    router.events.on("hashChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
      router.events.off("hashChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <Layout>
      <Head>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <>
        {GA_ID ? (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="ga" defer strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>
        ) : (
          "undefined"
        )}
      </>

      <div className={styles.main}>
        <Component {...pageProps} />
      </div>
    </Layout>
  )
}

export default MyApp
