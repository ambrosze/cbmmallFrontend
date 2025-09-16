import { formatPhoneNumber } from "@/utils/fx";
import { Icon } from "@iconify/react";
import React from "react";

interface Props {
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string;
  createdAt?: string;
  emailVerified?: string | null;
  phoneVerified?: string | null;
}

const formatDate = (date?: string) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return date;
  }
};

export const initialsFromName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
};

const VerifiedBadge = ({ type }: { type: "email" | "phone" }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
    <Icon icon="line-md:confirm" className="text-green-600" width={12} />
    {type === "email" ? "Email Verified" : "Phone Verified"}
  </span>
);

const PendingBadge = ({ type }: { type: "email" | "phone" }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
    <Icon icon="mdi:clock-outline" className="text-amber-500" width={12} />
    {type === "email" ? "Email Pending" : "Phone Pending"}
  </span>
);

const ProfileAvatarCard: React.FC<Props> = ({
  name,
  email,
  phone,
  avatarUrl,
  createdAt,
  emailVerified,
  phoneVerified,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-40/10 rounded-full blur-3xl" />
      </div>
      <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-28 h-28 rounded-2xl object-cover ring-4 ring-primary-40/10"
            />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-40/20 to-primary-40/40 flex items-center justify-center text-3xl font-semibold text-primary-900 ring-4 ring-primary-40/10">
              {initialsFromName(name)}
            </div>
          )}
          <span className="absolute -bottom-2 -right-2 bg-white rounded-xl shadow p-2 border border-gray-200">
            <Icon
              icon="solar:user-bold"
              width={18}
              className="text-primary-40"
            />
          </span>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              {name}
              <span className="text-sm font-medium text-white bg-primary-40 px-2 py-0.5 rounded-md border border-primary-100">
                User
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Icon icon="mdi:email-outline" width={16} />
                <span>{email}</span>
              </div>
              {emailVerified ? (
                <VerifiedBadge type="email" />
              ) : (
                <PendingBadge type="email" />
              )}
            </div>
            {phone && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Icon icon="mdi:phone-outline" width={16} />
                  <span>{formatPhoneNumber(phone)}</span>
                </div>
                {phoneVerified ? (
                  <VerifiedBadge type="phone" />
                ) : (
                  <PendingBadge type="phone" />
                )}
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <Icon icon="mdi:calendar" width={14} />
              Joined {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarCard;
