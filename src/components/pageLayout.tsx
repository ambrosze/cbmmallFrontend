import useNetworkStatus from "@/hooks/useNetworkStatus";
import { ConfigProvider } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import {
  toggleCloseGlobalModal,
  toggleLargeCloseGlobalModal,
  toggleLargeOpenGlobalModal,
  toggleMobileSidebar,
} from "@/redux-store/slice/globalModalToggle";
import { parseCookies } from "nookies";
import { useDispatch, useSelector } from "react-redux";
import ImgError from "../../public/states/notificationToasts/error.svg";

import CustomToast from "./sharedUI/Toast/CustomToast";
import { showPlannerToast } from "./sharedUI/Toast/plannerToast";
import Sidebar from "./sidebar";

interface IProps {
  children: React.ReactNode;
}

const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/reset-password",
  "/auth/verify-reset-password",
  "/auth/update-password",
];
const dashboardRoutes = ["/dashboard"];

// Assuming you want to handle standard JavaScript Errors

const PageLayout = ({ children }: IProps) => {
  const router = useRouter();
  const pathName = router.asPath;
  const isOnline = useNetworkStatus();
  const allCookies = parseCookies();
  // Assuming you want to retrieve a specific cookie named 'authToken'
  const token = allCookies["token"];
  const { isOpenSideNavBar, isAffiliateGlobalModal } = useSelector(
    (state: any) => state.openGlobalModal
  );
  const dispatch = useDispatch();
  // Add this function to strip query parameters from the path
  const getBasePath = (path: string) => {
    return path.split("?")[0];
  };
  const handleOpenSideNavBar = () => {
    console.log("Toggle sidebar - current state:", isOpenSideNavBar);
    dispatch(toggleMobileSidebar()); // Use the dedicated mobile toggle action
  };

  const handleCloseSideNavBar = () => {
    dispatch(toggleCloseGlobalModal());
  };

  const handleOpenAffiliateModal = () => {
    dispatch(toggleLargeOpenGlobalModal());
  };

  const handleCloseAffiliateModal = () => {
    dispatch(toggleLargeCloseGlobalModal());
  };
  // error boundary component for handling errors

  useEffect(() => {
    if (!token && !authRoutes.includes(getBasePath(pathName))) {
      router.push("/auth/login");
    }
  }, [token]);

  useEffect(() => {
    if (!isOnline) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"You are offline"}
              title={
                <>
                  You are <span className="font-bold">offline.</span>
                </>
              }
              image={ImgError}
              textColor="red"
              message="Please check your internet connection."
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your internet connection.",
      });
    }
  }, [isOnline]);

  return (
    // <ErrorBoundary
    //   FallbackComponent={ErrorFallback}
    //   onReset={() => {
    //     // Reset the state of your app so the error doesn't happen again
    //     router.reload()
    //   }}
    //   resetKeys={[getBasePath(pathName)]}
    // >
    <ConfigProvider
      componentSize="middle"
      theme={{
        token: {
          colorPrimary: "#C1A213",
          fontSize: 16,
        },
      }}
    >
      {authRoutes.includes(getBasePath(pathName)) ? (
        <>
          <div
            style={{
              backgroundImage: "url(/images/auth-bg.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
            className={`lg:px-[100px] min-h-screen w-full  flex justify-center items-center px-[20px] pb-10`}
          >
            {children}
          </div>
        </>
      ) : (
        <div className="flex flex-col bg-[#F0F1F3] ">
          <div className="items-baseline gap-4 relative">
            {!authRoutes.includes(getBasePath(pathName)) && (
              <div
                className={`z-50 transition-transform duration-300 ease-in-out ${
                  isOpenSideNavBar
                    ? "fixed top-0 left-0"
                    : "fixed top-0 -left-[280px] lg:left-0"
                } h-screen bg-[#F7FAFC] lg:block`}
              >
                <Sidebar
                  handleOpenAffiliateModal={handleOpenAffiliateModal}
                  handleOpenSideNavBar={handleOpenSideNavBar}
                />
              </div>
            )}

            {!authRoutes.includes(getBasePath(pathName)) ? (
              <div className={`min-h-screen w-[100%]`}>{children}</div>
            ) : (
              <div className={`mx-auto mt-16 min-h-screen w-full`}>
                {children}
              </div>
            )}
          </div>
        </div>
      )}
      {isOpenSideNavBar && (
        <div
          onClick={handleCloseSideNavBar}
          className="fixed z-40 top-0 left-0 right-0 bottom-0 w-full min-h-screen bg-black/50 lg:hidden"
        />
      )}
    </ConfigProvider>
    // </ErrorBoundary>
  );
};

export default PageLayout;
