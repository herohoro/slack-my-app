// 無限スクロールの実装になったらコメントアウトを無くす。
import "../styles/globals.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../component/loading";

// const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setPageLoading(true);
    const handleComplete = () => setPageLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  // TODO 正式なローディングコンポーネントにする
  const loadingComponent = <Loading />;

  return (
    // <QueryClientProvider client={queryClient}>
    <div>
      {pageLoading && loadingComponent}
      <Component {...pageProps} />
    </div>
    // </QueryClientProvider>
  );
}
export default MyApp;
