import { useCheckPermission } from "@/hooks/useCheckPermission";
import { PermissionName } from "@/types/permissionTypes";
import React from "react";
import SkeletonLoaderForPage from "../sharedUI/Loader/SkeletonLoaderForPage";
import PermissionDenied from "./PermissionDenied";

interface PermissionGuardProps {
  permission: PermissionName;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
}) => {
  const { hasPermission, isLoading } = useCheckPermission(permission);

  if (isLoading) {
    return (
      <div>
        <SkeletonLoaderForPage />
      </div>
    );
  }

  if (!hasPermission) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
