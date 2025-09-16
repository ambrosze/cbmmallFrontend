import { StockTransferDatum } from "@/types/StockTransferTypes";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react";
import { Badge, Card } from "antd";
import React from "react";

interface StockTransferDetailsModalProps {
  selectedItem: StockTransferDatum | null;
}

const StockTransferDetailsModal: React.FC<StockTransferDetailsModalProps> = ({
  selectedItem,
}) => {
  if (!selectedItem) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "blue";
      case "dispatched":
        return "orange";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "mdi:clock-outline";
      case "dispatched":
        return "mdi:truck-outline";
      case "accepted":
        return "mdi:check-circle-outline";
      case "rejected":
        return "mdi:close-circle-outline";
      default:
        return "mdi:help-circle-outline";
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Header Section */}
      <div className="text-center pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Stock Transfer Details
        </h2>
        <div className="flex items-center justify-center gap-2">
          <Badge
            status={getStatusColor(selectedItem.status) as any}
            text={
              <span className="flex items-center gap-2">
                <Icon
                  icon={getStatusIcon(selectedItem.status)}
                  className="w-4 h-4"
                />
                <span className="capitalize font-medium">
                  {selectedItem.status}
                </span>
              </span>
            }
          />
        </div>
      </div>

      {/* Reference and Basic Info */}
      <Card className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Icon icon="mdi:file-document-outline" className="w-5 h-5" />
              Transfer Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Reference Number
                </label>
                <p className="text-base font-mono bg-gray-50 p-2 rounded border">
                  {selectedItem.reference_no}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Comment
                </label>
                <p className="text-base text-gray-800">
                  {selectedItem.comment || "No comment provided"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Icon icon="mdi:truck-delivery-outline" className="w-5 h-5" />
              Driver Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Driver Name
                </label>
                <p className="text-base text-gray-800">
                  {selectedItem.driver_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <p className="text-base text-gray-800 flex items-center gap-2">
                  <Icon icon="mdi:phone" className="w-4 h-4" />
                  {selectedItem.driver_phone_number}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Store Information */}
      <Card className="shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Icon icon="mdi:store-outline" className="w-5 h-5" />
          Store Transfer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Icon icon="mdi:store-remove" className="w-4 h-4" />
              From Store
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {selectedItem.from_store?.name}
              </p>
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <Icon
                  icon="mdi:map-marker"
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                {selectedItem.from_store?.address}
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Icon icon="mdi:store-plus" className="w-4 h-4" />
              To Store
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {selectedItem.to_store?.name}
              </p>
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <Icon
                  icon="mdi:map-marker"
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                {selectedItem.to_store?.address}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* People Involved */}
      <Card className="shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Icon icon="mdi:account-group-outline" className="w-5 h-5" />
          People Involved
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Icon icon="mdi:account-arrow-right" className="w-4 h-4" />
              Sender
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {selectedItem.sender?.first_name}{" "}
                {selectedItem.sender?.last_name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Icon icon="mdi:email" className="w-4 h-4" />
                {selectedItem.sender?.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Icon icon="mdi:phone" className="w-4 h-4" />
                {selectedItem.sender?.phone_number}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Icon icon="mdi:account-arrow-left" className="w-4 h-4" />
              Receiver
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">
                {selectedItem.receiver?.first_name}{" "}
                {selectedItem.receiver?.last_name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Icon icon="mdi:email" className="w-4 h-4" />
                {selectedItem.receiver?.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Icon icon="mdi:phone" className="w-4 h-4" />
                {selectedItem.receiver?.phone_number}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory Information */}
      <Card className="shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Icon icon="mdi:package-variant" className="w-5 h-5" />
          Inventory Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Icon
              icon="mdi:counter"
              className="w-6 h-6 mx-auto mb-2 text-blue-600"
            />
            <p className="text-2xl font-bold text-blue-800">
              {(selectedItem as any).inventories_count}
            </p>
            <p className="text-sm text-blue-600">Items Count</p>
          </div>
          {/* Add more inventory stats here if available */}
        </div>
      </Card>

      {/* Timeline/Status Updates */}
      <Card className="shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Icon icon="mdi:timeline-clock-outline" className="w-5 h-5" />
          Timeline
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <Icon icon="mdi:plus-circle" className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-800">Transfer Created</p>
              <p className="text-sm text-gray-600">
                {newUserTimeZoneFormatDate(
                  selectedItem.created_at,
                  "DD/MM/YYYY HH:mm"
                )}
              </p>
            </div>
          </div>

          {selectedItem.dispatched_at && (
            <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
              <Icon icon="mdi:truck" className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-800">Dispatched</p>
                <p className="text-sm text-gray-600">
                  {newUserTimeZoneFormatDate(
                    selectedItem.dispatched_at,
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
              </div>
            </div>
          )}

          {selectedItem.accepted_at && (
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <Icon
                icon="mdi:check-circle"
                className="w-5 h-5 text-green-600"
              />
              <div>
                <p className="font-medium text-gray-800">Accepted</p>
                <p className="text-sm text-gray-600">
                  {newUserTimeZoneFormatDate(
                    selectedItem.accepted_at,
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
              </div>
            </div>
          )}

          {selectedItem.rejected_at && (
            <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
              <Icon icon="mdi:close-circle" className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-800">Rejected</p>
                <p className="text-sm text-gray-600">
                  {newUserTimeZoneFormatDate(
                    selectedItem.rejected_at,
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
                {selectedItem.rejection_reason && (
                  <p className="text-sm text-red-600 mt-1">
                    Reason: {selectedItem.rejection_reason}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StockTransferDetailsModal;
