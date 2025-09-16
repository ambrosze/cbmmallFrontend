import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PaginationComponent from "@/components/sharedUI/PaginationComponent";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationQuery,
  useMarkEveryNotificationAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/services/notification";
import { newUserTimeZoneFormatDate } from "@/utils/fx";

import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Modal,
  Select,
  Tag,
  Tooltip,
  message,
} from "antd";
import { useState } from "react";

const { Option } = Select;

const index = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // API calls
  const { data, isLoading, refetch } = useGetAllNotificationQuery({
    q: search,
    page: currentPage,
    per_page: 12,
    filter: selectedFilter !== "all" ? selectedFilter : undefined,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkEveryNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      try {
        await markAsRead({ notification_id: notification.id });
        refetch();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      message.success("All notifications marked as read");
      refetch();
    } catch (error) {
      message.error("Error marking all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification({ id: notificationId });
      message.success("Notification deleted successfully");
      refetch();
    } catch (error) {
      message.error("Error deleting notification");
    }
  };

  const getNotificationIcon = (type: string, level: string) => {
    if (type === "stock_transfer_dispatched") return "mdi:truck";
    if (level === "success") return "mdi:check-circle";
    if (level === "warning") return "mdi:alert";
    if (level === "error") return "mdi:alert-circle";
    return "mdi:information";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "processing";
    }
  };

  const unreadCount = data?.data?.filter((n: any) => !n.read)?.length || 0;

  return (
    <div className="">
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search Notifications"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />

      <AttributeHeader
        headerText={`All Notifications ${
          data?.meta?.total ? `(${data.meta.total})` : ""
        }`}
        showAddButton={false}
        btnText=""
        onClick={() => {}}
      />

      <SharedLayout>
        {/* Filters and Actions Bar */}
        <div className="mb-6 flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:filter" className="text-gray-500" />
              <Select
                value={selectedFilter}
                onChange={setSelectedFilter}
                className="lg:w-48"
                placeholder="Filter by status"
              >
                <Option value="all">All Notifications</Option>
                <Option value={false}>Unread Only</Option>
                <Option value={true}>Read Only</Option>
              </Select>
            </div>

            {unreadCount > 0 && (
              <Badge count={unreadCount} className="flex items-center">
                <span className="text-sm text-gray-600">
                  {unreadCount} unread notification
                  {unreadCount > 1 ? "s" : ""}
                </span>
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<Icon icon="mdi:check-all" />}
                onClick={handleMarkAllAsRead}
                size="small"
              >
                Mark All Read
              </Button>
            )}
            <Button
              icon={<Icon icon="mdi:refresh" />}
              onClick={() => refetch()}
              size="small"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Notifications Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Icon
                icon="eos-icons:loading"
                className="text-4xl text-blue-500 animate-spin mb-4"
              />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-500 mb-2">No notifications found</p>
                  {search && (
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  )}
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {data?.data?.map((notification: any) => (
              <Card
                key={notification.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 rounded-xl overflow-hidden relative ${
                  !notification.read
                    ? "ring-2 ring-blue-200 shadow-lg"
                    : "shadow-md hover:shadow-lg"
                }`}
                onClick={() => handleNotificationClick(notification)}
                styles={{
                  body: { padding: "0" },
                }}
              >
                {/* Unread indicator bar */}
                {!notification.read && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}

                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Icon with enhanced styling */}
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          notification.level === "success"
                            ? "bg-gradient-to-br from-green-100 to-green-50 border border-green-200"
                            : notification.level === "warning"
                            ? "bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200"
                            : notification.level === "error"
                            ? "bg-gradient-to-br from-red-100 to-red-50 border border-red-200"
                            : "bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200"
                        }`}
                      >
                        <Icon
                          icon={getNotificationIcon(
                            notification.type,
                            notification.level
                          )}
                          className={`text-xl ${
                            notification.level === "success"
                              ? "text-green-600"
                              : notification.level === "warning"
                              ? "text-yellow-600"
                              : notification.level === "error"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Status and unread indicator */}
                        <div className="flex items-center gap-2 mb-2">
                          {!notification.read && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-blue-600">
                                New
                              </span>
                            </div>
                          )}
                          <Tag
                            color={getLevelColor(notification.level)}
                            className="rounded-full px-2 py-1 text-xs font-medium border-0"
                          >
                            {notification.level.toUpperCase()}
                          </Tag>
                        </div>

                        {/* Title with better typography */}
                        <h3
                          className={`font-semibold text-sm leading-tight line-clamp-2 ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                      </div>
                    </div>

                    {/* Delete button with improved visibility */}
                    <Tooltip title="Delete notification" placement="top">
                      <Button
                        type="text"
                        size="small"
                        icon={
                          <Icon
                            icon="mdi:delete-outline"
                            className="text-base"
                          />
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg p-2 min-w-8 h-8 flex items-center justify-center"
                      />
                    </Tooltip>
                  </div>

                  {/* Message with enhanced readability */}
                  <div className="space-y-3">
                    <p
                      className={`text-sm leading-relaxed line-clamp-3 ${
                        !notification.read ? "text-gray-700" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {/* Footer with enhanced design */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-gray-100">
                        <Icon
                          icon="mdi:clock-outline"
                          className="text-xs text-gray-500"
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {newUserTimeZoneFormatDate(
                          notification.created_at,
                          "MMM DD, YYYY HH:mm"
                        )}
                      </span>
                    </div>

                    {notification.type && (
                      <Tag className="text-xs bg-gray-50 text-gray-600 border-gray-200 rounded-full px-3 py-1">
                        {notification.type.replace("_", " ").toUpperCase()}
                      </Tag>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>

                  {/* Click indicator */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>Click to view</span>
                      <Icon icon="mdi:arrow-right" className="text-xs" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          {data?.meta?.total! > 0 && (
            <PaginationComponent
              paginationData={{
                current_page: data?.meta?.current_page!,
                last_page: data?.meta?.last_page!,
                per_page: data?.meta?.per_page!,
                total: data?.meta?.total!,
                next_page_url: data?.links?.next!,
                prev_page_url: data?.links?.prev!,
              }}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Notification Details Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  selectedNotification?.level === "success"
                    ? "bg-green-100"
                    : selectedNotification?.level === "warning"
                    ? "bg-yellow-100"
                    : selectedNotification?.level === "error"
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}
              >
                <Icon
                  icon={getNotificationIcon(
                    selectedNotification?.type,
                    selectedNotification?.level
                  )}
                  className={`text-xl ${
                    selectedNotification?.level === "success"
                      ? "text-green-600"
                      : selectedNotification?.level === "warning"
                      ? "text-yellow-600"
                      : selectedNotification?.level === "error"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">Notification Details</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Tag color={getLevelColor(selectedNotification?.level)}>
                    {selectedNotification?.level}
                  </Tag>
                  {selectedNotification && !selectedNotification.read && (
                    <Badge status="processing" text="Unread" />
                  )}
                </div>
              </div>
            </div>
          }
          open={showDetailsModal}
          onCancel={() => setShowDetailsModal(false)}
          footer={[
            <Button key="close" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedNotification.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium capitalize">
                    {selectedNotification.type?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Level:</span>
                  <p className="font-medium capitalize">
                    {selectedNotification.level}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">
                    {newUserTimeZoneFormatDate(
                      selectedNotification.created_at,
                      "MMM DD, YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="font-medium">
                    {selectedNotification.read ? "Read" : "Unread"}
                  </p>
                </div>
              </div>

              {selectedNotification.meta && (
                <>
                  <Divider />
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      Additional Details
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {selectedNotification.meta.reference_no && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reference:</span>
                            <span className="font-medium">
                              {selectedNotification.meta.reference_no}
                            </span>
                          </div>
                        )}
                        {selectedNotification.meta.sender_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Sender:</span>
                            <span className="font-medium">
                              {selectedNotification.meta.sender_name}
                            </span>
                          </div>
                        )}
                        {selectedNotification.meta.total_quantity && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Total Quantity:
                            </span>
                            <span className="font-medium">
                              {selectedNotification.meta.total_quantity}
                            </span>
                          </div>
                        )}
                        {selectedNotification.meta.inventory_count && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Items Count:</span>
                            <span className="font-medium">
                              {selectedNotification.meta.inventory_count}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* {selectedNotification.action_url && (
                <>
                  <Divider />
                  <div className="flex justify-end">
                    <Button
                      type="primary"
                      icon={<Icon icon="mdi:open-in-new" />}
                      onClick={() =>
                        window.open(selectedNotification.action_url, "_blank")
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </>
              )} */}
            </div>
          )}
        </Modal>
      </SharedLayout>
    </div>
  );
};

export default index;
