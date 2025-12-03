
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Script from "next/script";

export default function AunuCloudApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
      <div className="app-root">
        <Component {...pageProps} />
      </div>
    </>
  );
}
