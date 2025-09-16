// pages/_app.tsx
import PageLayout from "@/components/pageLayout";
import SEOHead from "@/components/SEOHead";
import { wrapper } from "@/redux-store/store";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { Inspector } from 'react-dev-inspector'


export default function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      <SEOHead
        title={"Goldwise Jewelry"}
        // description={
        //   "Kuadratik is a remote-first tech company dedicated to empowering businesses of all sizes with innovative solutions that drive efficiency and lasting impact. Operating from Canada and Nigeria, we serve clients globally across the retail, logistics, and EduTech sectors."
        // }
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
