// pages/_app.tsx
import PageLayout from "@/components/pageLayout";
import SEOHead from "@/components/SEOHead";
import { wrapper } from "@/redux-store/store";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Inspector } from "react-dev-inspector";
import "react-phone-input-2/lib/style.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      <SEOHead
        title={"CBM MALL"}
        description={
          "CBM MALL - Your One-Stop Online Shop for Quality Products and Exceptional Service. Explore Our Wide Range of Items Today!."
        }
        // image={"/images/kuadratik.png"}
        // key={pageProps.seoData?.slug || ""}
        // storeTitle={pageProps.seoData?.title || "myEKI - Marketplace"}
      />
      {isClient ? (
        <PageLayout>
          <Inspector />
          <Component {...props} />
        </PageLayout>
      ) : (
        <></>
      )}
      <ToastContainer limit={3} />
    </Provider>
  );
}
