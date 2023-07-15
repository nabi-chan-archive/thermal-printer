import "@/styles/globals.css";
import "@blocknote/core/style.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        newestOnTop
        hideProgressBar
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
}
