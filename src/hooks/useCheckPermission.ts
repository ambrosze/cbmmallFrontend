import { useGetAllProfileQuery } from "@/services/profile";
import { PermissionName } from "@/types/permissionTypes";

export const useCheckPermission = (requiredPermission: PermissionName) => {
  const { data: profileData, isLoading } = useGetAllProfileQuery({
    include: "roles,staff,permission",
    append: "is_admin",
  });

  // Adjust this path based on your actual API response structure
  // Example: profileData?.data?.permissions or profileData?.permissions
  const userPermissions = profileData?.data?.permissions || [];

  // Super admin bypass (optional, if you have a specific role that sees everything)
  const isSuperAdmin = profileData?.data?.is_admin === true;
  const alwayShowProductsViewAny = true; // Temporary bypass for products.viewAny permission
  if (alwayShowProductsViewAny && requiredPermission === "products.viewAny") {
    return {
      hasPermission: true,
      isLoading,
      userPermissions,
    };
  }

  const hasPermission =
    isSuperAdmin ||
    userPermissions.some(
      (permission) => permission.name === requiredPermission
    );

  return {
    hasPermission,
    isLoading,
    userPermissions,
  };
};
