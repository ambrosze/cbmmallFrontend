import { toggleOpenGlobalModal } from "@/redux-store/slice/globalModalToggle";
import { api } from "@/services";
import { useGetAllStoresQuery } from "@/services/admin/store";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationQuery,
  useMarkEveryNotificationAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/services/notification";
import { useGetAllProfileQuery } from "@/services/profile";
import { UserResponseTopLevel } from "@/types/loginInUserType";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge, Button, Dropdown, Empty, Space, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "react-use";
import InputSearch from "./Input/InputSearch";
import { initialsFromName } from "./Profile/ProfileAvatarCard";
import PlannerModal from "./sharedUI/PlannerModal";
// import { useGetAllStoresQuery } from "@/services/your-store-api";

interface IProps {
  isOpenSideNavBar: boolean;
  handleOpenSideNavBar: () => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  placeHolderText?: string;
}

export function clearCookie(cookieName: string): void {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
const Header = ({
  isOpenSideNavBar,
  handleOpenSideNavBar,
  search,
  setSearch,
  showSearch,
  placeHolderText,
}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [loginResponse, setLoginResponse] =
    useLocalStorage<UserResponseTopLevel | null>("authLoginResponse", null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data, isLoading: isLoadingProfile } = useGetAllProfileQuery({});
  const profile = (data as any)?.data; // Aligning with provided sample response

  const {
    data: storeData,
    refetch,
    isLoading,
  } = useGetAllStoresQuery(
    {
      q: storeSearch,
      page: currentPage,
      // include: "manager",
      per_page: 15,
      paginate: false,
    },
    {
      skip: !loginResponse?.user.is_admin,
    }
  );

  // Notification queries and mutations
  const {
    data: notificationData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useGetAllNotificationQuery({
    per_page: 6,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkEveryNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const fullName = useMemo(() => {
    if (!profile) return "";
    return [profile.first_name, profile.middle_name, profile.last_name]
      .filter(Boolean)
      .join(" ");
  }, [profile]);
  // Load selected store on component mount
  useEffect(() => {
    const storedStoreId = localStorage.getItem("selectedStoreId");
    const loginResponseStr = localStorage.getItem("authLoginResponse");

    if (storedStoreId) {
      setSelectedStoreId(storedStoreId);
    }

    if (loginResponseStr) {
      try {
        const loginResponse = JSON.parse(loginResponseStr);
        if (loginResponse.selectedStore) {
          setCurrentStore(loginResponse.selectedStore);
        } else if (loginResponse?.user?.staff?.store_id) {
          // Set default store info if available
          setSelectedStoreId(loginResponse.user.staff.store_id);
        }
      } catch (error) {
        console.error("Error parsing login response:", error);
      }
    }
  }, []);

  // Update current store when storeData changes
  useEffect(() => {
    if (storeData?.data && selectedStoreId) {
      const store = storeData.data.find((s: any) => s.id === selectedStoreId);
      if (store) {
        setCurrentStore(store);
      }
    }
  }, [storeData, selectedStoreId]);

  // Auto-select store from profile if available and no selection has been made yet
  useEffect(() => {
    // Ensure we have profile data
    if (!profile) return;

    // Prefer the explicit profile.store.id, fallback to staff.store_id
    const profileStoreId: string | null =
      (profile as any)?.store?.id || (profile as any)?.staff?.store_id || null;

    if (!profileStoreId) return;

    // If user already chose a store previously, don't override their choice
    const storedStoreId = localStorage.getItem("selectedStoreId");
    if (storedStoreId) return;

    // If component already has the same selected store, do nothing
    if (selectedStoreId === profileStoreId) return;

    // Persist default selection
    localStorage.setItem("selectedStoreId", profileStoreId);
    setSelectedStoreId(profileStoreId);

    // Try to set a richer currentStore object
    let selectedStoreObj: any = (profile as any)?.store || null;
    if (storeData?.data) {
      const fromList = storeData.data.find((s: any) => s.id === profileStoreId);
      if (fromList) selectedStoreObj = fromList;
    }
    if (selectedStoreObj) setCurrentStore(selectedStoreObj);

    // Update authLoginResponse.selectedStore if present in storage
    const loginResponseStr = localStorage.getItem("authLoginResponse");
    if (loginResponseStr) {
      try {
        const lr = JSON.parse(loginResponseStr);
        const updated = {
          ...lr,
          selectedStore: selectedStoreObj
            ? {
                id: selectedStoreObj.id,
                name: selectedStoreObj.name,
                address: selectedStoreObj.address,
                is_warehouse: selectedStoreObj.is_warehouse,
              }
            : {
                id: profileStoreId,
                name: (profile as any)?.store?.name ?? "",
                address: (profile as any)?.store?.address ?? "",
                is_warehouse: (profile as any)?.store?.is_warehouse ?? 0,
              },
        };
        localStorage.setItem("authLoginResponse", JSON.stringify(updated));

        // Reset RTK Query cache to refetch with store context
        dispatch(api.util.resetApiState());
      } catch (e) {
        console.error("Error updating default selected store:", e);
      }
    }
  }, [profile, storeData, selectedStoreId, dispatch]);

  const handleStoreSelect = (store: any) => {
    // Save selected store ID to localStorage
    localStorage.setItem("selectedStoreId", store.id);
    setSelectedStoreId(store.id);
    setCurrentStore(store);

    // Update the auth login response with selected store info
    const loginResponseStr = localStorage.getItem("authLoginResponse");
    if (loginResponseStr) {
      try {
        const loginResponse = JSON.parse(loginResponseStr);

        // Create updated login response with selected store
        const updatedLoginResponse = {
          ...loginResponse,
          selectedStore: {
            id: store.id,
            name: store.name,
            address: store.address,
            is_warehouse: store.is_warehouse,
          },
        };

        // Save updated login response
        localStorage.setItem(
          "authLoginResponse",
          JSON.stringify(updatedLoginResponse)
        );

        console.log("Selected store:", store);
        setShowStoreModal(false);

        // Invalidate all RTK Query cache to force refetch with new store context
        dispatch(api.util.resetApiState());

        // Alternative: If you want to be more selective, you can invalidate specific tags
        // dispatch(api.util.invalidateTags(['Store', 'Product', 'Order'])); // Add your specific tags
      } catch (error) {
        console.error("Error updating auth login response:", error);
        setShowStoreModal(false);
      }
    } else {
      console.log("Selected store:", store);
      setShowStoreModal(false);

      // Still invalidate cache even if no login response
      dispatch(api.util.resetApiState());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authLoginResponse");
    sessionStorage.removeItem("authLoginResponse");
    sessionStorage.removeItem("selectedStoreId");
    clearCookie("token");
    router.push("/auth/login");
  };
  // useEffect(() => {
  //   if (isError) {
  //    localStorage.removeItem("authLoginResponse");
  //    sessionStorage.removeItem("authLoginResponse");
  //    clearCookie("token"); // Replace 'token' with the actual name of your cookie
  //    // Clear other auth state (Redux store etc)
  //    router.push("/auth/login");
  //   }
  // }, [isError]);
  const items = [
    {
      label: (
        <button
          onClick={() => {
            handleLogout();
          }}
          className="text-center w-full hover:font-bold"
        >
          Log Out
        </button>
      ),
      key: "0",
    },
  ];
  const handleToggleSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(toggleOpenGlobalModal());
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markAsRead({ notification_id: notificationId });
      refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (
    notificationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await deleteNotification({ id: notificationId });
      refetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount =
    notificationData?.data?.filter((n) => !n.read)?.length || 0;

  const notificationItems = {
    items: [
      {
        key: "notifications",
        label: (
          <div className="w-80 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  type="link"
                  size="small"
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notificationsLoading ? (
                <div className="p-4 text-center">
                  <Icon
                    icon="eos-icons:loading"
                    className="text-2xl text-gray-400 animate-spin"
                  />
                  <p className="text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : notificationData?.data?.length === 0 ? (
                <div className="p-4">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No notifications"
                    className="text-gray-400"
                  />
                </div>
              ) : (
                notificationData?.data?.map((notification: any) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`group p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              !notification.read ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          />
                          <h4
                            className={`font-medium text-sm truncate ${
                              !notification.read
                                ? "text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {notification.level && (
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                notification.level === "success"
                                  ? "bg-green-100 text-green-700"
                                  : notification.level === "warning"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : notification.level === "error"
                                  ? "bg-red-100 text-red-700"
                                  : notification.level === "info"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {notification.level}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mb-2 line-clamp-2 ${
                            !notification.read
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {notification.type && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                notification.type === "success"
                                  ? "bg-green-100 text-green-600"
                                  : notification.type === "warning"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : notification.type === "error"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {notification.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <Tooltip title="Delete notification">
                        <button
                          type="button"
                          aria-label="Delete notification"
                          onClick={(e) =>
                            handleDeleteNotification(notification.id, e)
                          }
                          className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 p-1 rounded-full transition-all flex-shrink-0"
                        >
                          <Icon icon="mdi:close" className="text-sm" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notificationData?.data?.length! > 0 && (
              <div className="p-3 border-t border-gray-100 text-center">
                <Button
                  type="link"
                  size="small"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    // Navigate to full notifications page
                    router.push("/notifications");
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        ),
      },
    ],
  };

  return (
    <div className="h-[86px] fixed w-full lg:px-[40px] px-5 z-40 bg-white flex justify-between items-center border-b border-[#CED4DA]">
      <button
        onClick={handleToggleSidebar}
        type="button"
        className="lg:hidden cursor-pointer"
        aria-label="Toggle sidebar menu"
      >
        {isOpenSideNavBar ? (
          <Icon
            icon="tabler:menu-3"
            className="text-2xl transition-all duration-300"
          />
        ) : (
          <Icon
            icon="line-md:menu-to-close-alt-transition"
            className="text-3xl transition-all duration-300"
          />
        )}
      </button>
      <div className="flex bg-white justify-between items-center w-full">
        <div className="lg:pl-[244px] flex-1">
          {showSearch && (
            <>
              {/* Desktop search - always visible */}
              <div className="hidden lg:block">
                <InputSearch
                  debounceTimer={0}
                  search={search}
                  setSearch={setSearch}
                  className="w-[400px] border-[1px] border-[#D0D5DD] rounded-[8px] py-2"
                  placeholder={placeHolderText!}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-5">
            {/* <Icon
              icon="mdi:plus-circle-outline"
              className="text-[24px] text-[#2C3137]"
            /> */}
            {/* <Icon
              icon="famicons:barcode-sharp"
              className="text-[24px] text-[#2C3137]"
            /> */}
            <div className="lg:hidden flex items-center gap-3">
              {showMobileSearch
                ? null
                : loginResponse?.user.is_admin && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStoreModal(true);
                      }}
                      className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-all duration-200 border border-gray-200"
                      title="Click to change store"
                    >
                      <Icon
                        icon="mdi:store"
                        className="text-[#2C3137] text-[16px]"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-gray-500 leading-tight">
                          Store
                        </span>
                        <span className="text-[11px] font-medium text-[#2C3137] max-w-[60px] truncate leading-tight">
                          {currentStore?.name || "Select"}
                        </span>
                      </div>
                      <Icon
                        icon="mdi:chevron-down"
                        className="text-[#2C3137] text-[12px]"
                      />
                    </div>
                  )}
              {/* Mobile search - toggle visibility */}
              <div className="lg:hidden">
                {showMobileSearch ? (
                  <div className="flex items-center gap-1 w-full max-w-[calc(100vw-150px)]">
                    <InputSearch
                      debounceTimer={0}
                      search={search}
                      setSearch={setSearch}
                      className="flex-1 min-w-0 border-[1px] border-[#D0D5DD] rounded-[8px] py-2"
                      placeholder={placeHolderText!}
                    />
                    <button
                      type="button"
                      aria-label="Close search"
                      onClick={() => setShowMobileSearch(false)}
                      className="text-[#2C3137] flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-all duration-300"
                    >
                      <Icon icon="mdi:close" className="text-[20px]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label="Open search"
                    onClick={() => setShowMobileSearch(true)}
                    className="text-[#2C3137] hover:bg-gray-100 rounded-full p-2 transition-all duration-300"
                  >
                    <Icon icon="mdi:magnify" className="text-[25px]" />
                  </button>
                )}
              </div>
              {/* Mobile Notification */}
              <Dropdown
                menu={{
                  ...notificationItems,
                  rootClassName: "relative left-10",
                }}
                trigger={["click"]}
                placement="bottomRight"
                overlayClassName="notification-dropdown"
              >
                <div className="relative cursor-pointer">
                  <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                    <Icon
                      icon="ri:notification-3-line"
                      className="text-[#2C3137] text-[24px] hover:text-blue-600 transition-colors"
                    />
                  </Badge>
                </div>
              </Dropdown>

              <Dropdown
                className=" lg:hidden"
                menu={{ items }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  {profile?.profile_photo_url ? (
                    <img
                      src={profile?.profile_photo_url}
                      alt={fullName}
                      className="w-[40px] h-[40px] cursor-pointer object-cover rounded-full ring-4 ring-blue-500/40"
                    />
                  ) : (
                    <div className="w-[40px] h-[40px] rounded-full cursor-pointer bg-gradient-to-br from-primary-40/20 to-primary-40/40 flex items-center justify-center text-base font-semibold text-primary-900 ring-4 ring-blue-500/40">
                      {initialsFromName(fullName || "User")}
                    </div>
                  )}
                </a>
              </Dropdown>
            </div>

            <Space>
              <div className={`lg:flex hidden items-center gap-4`}>
                {loginResponse?.user.is_admin && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStoreModal(true);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-[4.5px] rounded-lg transition-all duration-200 border border-gray-200"
                    title="Click to change store"
                  >
                    <Icon
                      icon="mdi:store"
                      className="text-[#2C3137] text-[20px]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Store</span>
                      <span className="text-sm font-medium text-[#2C3137] max-w-[100px] truncate">
                        {currentStore?.name || "Select Store"}
                      </span>
                    </div>
                    <Icon
                      icon="mdi:chevron-down"
                      className="text-[#2C3137] text-[16px]"
                    />
                  </div>
                )}
                {/* Desktop Notification */}
                <Dropdown
                  menu={notificationItems}
                  trigger={["click"]}
                  placement="bottomRight"
                  overlayClassName="notification-dropdown"
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="relative cursor-pointer"
                  >
                    <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                      <Icon
                        icon="ri:notification-3-line"
                        className="text-[#2C3137] text-[24px] hover:text-blue-600 transition-colors"
                      />
                    </Badge>
                  </a>
                </Dropdown>
              </div>
            </Space>
            <Dropdown
              className="hidden lg:block"
              menu={{ items }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                {profile?.profile_photo_url ? (
                  <img
                    src={profile?.profile_photo_url}
                    alt={fullName}
                    className="w-[40px] h-[40px] cursor-pointer object-cover rounded-full ring-4 ring-blue-500/40"
                  />
                ) : (
                  <div className="w-[40px] h-[40px] rounded-full cursor-pointer bg-gradient-to-br from-primary-40/20 to-primary-40/40 flex items-center justify-center text-base font-semibold text-primary-900 ring-4 ring-blue-500/40">
                    {initialsFromName(fullName || "User")}
                  </div>
                )}
              </a>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Store Selection Modal */}
      <PlannerModal
        modalOpen={showStoreModal}
        setModalOpen={setShowStoreModal}
        title="Select Store"
        width={600}
        height={500}
        onCloseModal={() => setShowStoreModal(false)}
      >
        <div className="py-4">
          {/* Display current active store */}
          {currentStore && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:check-circle"
                  className="text-blue-600 text-lg"
                />
                <div>
                  <p className="font-medium text-blue-800">
                    Current Store: {currentStore.name}
                  </p>
                  <p className="text-sm text-blue-600">
                    {currentStore.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          <InputSearch
            iconColor="top-[22px]"
            debounceTimer={0}
            search={storeSearch}
            setSearch={setStoreSearch}
            className="w-full border-[1px] border-[#D0D5DD] rounded-[8px] py-2 mb-4"
            placeholder="Search stores..."
          />

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Loading stores...</div>
            ) : (
              storeData?.data?.map((store: any) => {
                const isSelected = selectedStoreId === store.id;
                return (
                  <div
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    className={`p-3 border-b cursor-pointer transition-colors relative ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            isSelected ? "text-blue-800" : ""
                          }`}
                        >
                          {store.name}
                          {store.is_warehouse === "1" && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              HQ
                            </span>
                          )}
                        </h3>
                        <p
                          className={`text-sm ${
                            isSelected ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {store.address}
                        </p>
                      </div>
                      {isSelected && (
                        <Icon
                          icon="mdi:check-circle"
                          className="text-blue-600 text-xl ml-2"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PlannerModal>
    </div>
  );
};

export default Header;
