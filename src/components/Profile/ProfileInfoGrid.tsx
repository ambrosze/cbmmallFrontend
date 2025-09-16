import { formatPhoneNumber, newUserTimeZoneFormatDate } from "@/utils/fx";
import { Icon } from "@iconify/react";
import React from "react";

interface InfoItem {
  label: string;
  value?: React.ReactNode;
  icon?: string;
  highlight?: boolean;
}

interface Props {
  items: InfoItem[];
  columns?: number;
}

const ProfileInfoGrid: React.FC<Props> = ({ items, columns = 3 }) => {
  console.log("🚀 ~ ProfileInfoGrid ~ items:", items);
  return (
    <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-${columns} mt-6`}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`group relative rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-40 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-start gap-4">
            <div className="mt-1 w-10 h-10 rounded-lg bg-primary-40 flex items-center justify-center ring-1 ring-primary-100">
              <Icon
                icon={item.icon || "mdi:information-outline"}
                width={20}
                className="text-white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                {item.label}
              </p>
              <p
                className={`mt-1 text-sm font-medium text-gray-900 break-all ${
                  item.value ? "text-primary-600" : ""
                }`}
              >
                {item.label === "Phone Number"
                  ? formatPhoneNumber(item.value)
                  : item?.label === "Created At"
                  ? newUserTimeZoneFormatDate(
                      item?.value as any,
                      "DD/MM/YYYY HH:mm"
                    )
                  : item?.label === "Updated At"
                  ? newUserTimeZoneFormatDate(
                      item?.value as any,
                      "DD/MM/YYYY HH:mm"
                    )
                  : item.value || <span className="text-gray-400">—</span>}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileInfoGrid;
