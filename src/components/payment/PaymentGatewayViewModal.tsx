import { IPaymentGatewayDatum } from "@/types/paymentTypes";
import { newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tag } from "antd";

interface IProps {
  gateway: IPaymentGatewayDatum | null;
  isLoading?: boolean;
}

const PaymentGatewayViewModal = ({ gateway, isLoading }: IProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-40"></div>
      </div>
    );
  }

  if (!gateway) {
    return (
      <div className="text-center py-10 text-gray-500">
        No gateway data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo and Basic Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {gateway.logo_url ? (
            <img
              src={gateway.logo_url}
              alt={gateway.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Icon
              icon="mdi:credit-card-outline"
              width={32}
              height={32}
              className="text-gray-400"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 break-words">
            {gateway.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{gateway.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Tag color={gateway.is_disabled ? "red" : "green"}>
              {gateway.is_disabled ? "Disabled" : "Active"}
            </Tag>
            {gateway.is_default === 1 && <Tag color="blue">Default</Tag>}
            <Tag color="purple">{gateway.mode?.toUpperCase()}</Tag>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon="mdi:identifier" label="Code" value={gateway.code} />
        <InfoCard
          icon="mdi:sort-numeric-variant"
          label="Sort Order"
          value={gateway.sort_order?.toString() || "0"}
        />
        <InfoCard
          icon="mdi:calendar-plus"
          label="Created At"
          value={newUserTimeZoneFormatDate(
            gateway.created_at,
            "DD/MM/YYYY HH:mm"
          )}
        />
        <InfoCard
          icon="mdi:calendar-edit"
          label="Updated At"
          value={newUserTimeZoneFormatDate(
            gateway.updated_at,
            "DD/MM/YYYY HH:mm"
          )}
        />
      </div>

      {/* Supported Currencies */}
      {gateway.supported_currencies &&
        gateway.supported_currencies.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:currency-usd"
                width={20}
                height={20}
                className="text-primary-40"
              />
              <h4 className="font-medium text-gray-900">
                Supported Currencies
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {gateway.supported_currencies.map((currency) => (
                <Tag key={currency} className="!m-0">
                  {currency}
                </Tag>
              ))}
            </div>
          </div>
        )}

      {/* Credential Schema */}
      {gateway.credential_schema?.fields &&
        gateway.credential_schema.fields.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:key"
                width={20}
                height={20}
                className="text-blue-600"
              />
              <h4 className="font-medium text-gray-900">Credential Fields</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gateway.credential_schema.fields.map((field) => (
                <div
                  key={field.key}
                  className="bg-white rounded-md p-3 border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-800">
                      {field.label}
                    </span>
                    {field.required && (
                      <Tag color="red" className="!text-xs !m-0">
                        Required
                      </Tag>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 break-words">
                    {field.hint}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Tag className="!text-xs !m-0" color="default">
                      {field.input}
                    </Tag>
                    {field.sensitive && (
                      <Tag className="!text-xs !m-0" color="orange">
                        Sensitive
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Setting Schema */}
      {gateway.setting_schema?.fields &&
        gateway.setting_schema.fields.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:cog"
                width={20}
                height={20}
                className="text-green-600"
              />
              <h4 className="font-medium text-gray-900">Settings Fields</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gateway.setting_schema.fields.map((field) => (
                <div
                  key={field.key}
                  className="bg-white rounded-md p-3 border border-green-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-800">
                      {field.label}
                    </span>
                    {field.required && (
                      <Tag color="red" className="!text-xs !m-0">
                        Required
                      </Tag>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 break-words">
                    {field.hint}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Tag className="!text-xs !m-0" color="default">
                      {field.input}
                    </Tag>
                    {field.sensitive && (
                      <Tag className="!text-xs !m-0" color="orange">
                        Sensitive
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

// Helper component for info cards
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="w-8 h-8 rounded-md bg-primary-40 flex items-center justify-center flex-shrink-0">
      <Icon icon={icon} width={18} height={18} className="text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-gray-900 break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default PaymentGatewayViewModal;
