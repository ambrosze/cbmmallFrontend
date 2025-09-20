// import { useGetUserProfileQuery } from "@/services/global";
import { UserResponseTopLevel } from "@/types/loginInUserType";
import { Icon } from "@iconify/react";
import { GetProp, Menu, MenuProps } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "react-use";
import { clearCookie } from "./header";
import Logo from "/public/images/logo-cbm.png";
type MenuItem = GetProp<MenuProps, "items">[number];
interface IProps {
  setToggleNavbar?: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenAffiliateModal: any;
  handleOpenSideNavBar: any;
}

const Sidebar = ({
  setToggleNavbar,
  handleOpenAffiliateModal,
  handleOpenSideNavBar,
}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathName = router.asPath;
  const [loginResponse, setLoginResponse] =
    useLocalStorage<UserResponseTopLevel | null>("authLoginResponse", null);
  // const { data, isLoading } = useGetUserProfileQuery({
  //   include: "wallet,referralCode,roles",
  //   append: "is_admin",
  // });
  const handleLogout = () => {
    localStorage.removeItem("authLoginResponse");
    sessionStorage.removeItem("authLoginResponse");
    sessionStorage.removeItem("selectedStoreId");
    clearCookie("token");
    router.push("/auth/login");
  };
  const data: any = [];
  const isAdmin = data?.data?.is_admin;

  // Function to determine active menu keys based on current path
  const getActiveMenuKeys = () => {
    const path = router.asPath.split("?")[0]; // Remove query parameters

    if (path.includes("/dashboard")) return ["1"];

    // Check admin routes first (more specific)
    if (path.includes("/admin/items")) return ["53", "sub4"];
    if (path.includes("/admin/staffs")) return ["50", "sub4"];
    if (path.includes("/admin/daily-gold-price")) return ["55", "sub4"];
    if (path.includes("/admin/stores")) return ["51", "sub4"];
    if (path.includes("/admin/roles")) return ["52", "sub4"];
    if (path.includes("/admin/discounts")) return ["56", "sub4"];

    // Then check regular routes
    if (path.includes("/products")) return ["2", "sub1"];
    if (path.includes("/stock-transfer")) return ["3", "sub1"];
    if (path.includes("/scrapes")) return ["4", "sub1"];
    if (
      path.includes("/sales/sales-list") ||
      path.includes("/sales/sales-inventory")
    )
      return ["20", "sub2"];
    if (path.includes("/sales/pos")) return ["22", "sub2"];
    if (path.includes("/attributes/category")) return ["30", "sub3"];
    if (path.includes("/attributes/types")) return ["31", "sub3"];
    if (path.includes("/attributes/colours")) return ["32", "sub3"];
    if (path.includes("/attributes")) return ["40"];
    if (path.includes("/category")) return ["30"];
    if (path.includes("/help")) return ["100"];
    if (path.includes("/settings")) return ["101"];

    return ["1"]; // Default to dashboard
  };

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <Icon icon="mage:dashboard" width="20" height="20" />,
      label: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },

    {
      key: "sub1",
      label: "Inventory",
      icon: <Icon icon="fluent:box-24-regular" width="20" height="20" />,
      children: [
        {
          key: "2",
          label: "Products",
          onClick: () => {
            router.push("/products");
          },
        },
        {
          key: "4",
          label: "Scrapes",
          onClick: () => {
            router.push("/scrapes");
          },
        },
        {
          key: "3",
          label: "Stock transfer",
          onClick: () => {
            router.push("/stock-transfer");
          },
        },
        // { key: "4", label: "Awaiting Stock", onClick: () => {} },
        // { key: "5", label: "Return stock", onClick: () => {} },
      ],
    },

    {
      key: "sub2",
      label: "Sales",
      icon: <Icon icon="mynaui:cart" width="20" height="20" />,
      children: [
        {
          key: "20",
          icon: <Icon icon="iconoir:home-sale" width="20" height="20" />,
          label: "Sales",
          onClick: () => {
            router.push("/sales/sales-list");
          },
        },

        {
          key: "22",
          label: "Pos",
          icon: <Icon icon="mdi:line-scan" width="20" height="20" />,
          onClick: () => {
            router.push("/sales/pos");
          },
        },
        // { key: "23", label: "Return Item" },
      ],
    },
    {
      key: "40",
      icon: (
        <Icon icon="flowbite:cell-attributes-outline" width="20" height="20" />
      ),
      label: "Attributes",
      onClick: () => {
        router.push("/attributes");
      },
    },
    {
      key: "30",
      icon: <Icon icon="iconamoon:category-light" width="20" height="20" />,
      label: "Category",
      onClick: () => {
        router.push("/category");
      },
    },
    // {
    //   key: "sub3",
    //   label: "Attributes",
    //   icon: <Icon icon="system-uicons:list-add" width="21" height="21" />,
    //   children: [
    //     {
    //       key: "30",
    //       label: "Category",
    //       onClick: () => {
    //         router.push("/attributes/category");
    //       },
    //     },
    //     {
    //       key: "31",
    //       label: "Types",
    //       onClick: () => {
    //         router.push("/attributes/types");
    //       },
    //     },
    //     {
    //       key: "32",
    //       label: "Colours",
    //       onClick: () => {
    //         router.push("/attributes/colours");
    //       },
    //     },
    //   ],
    // },
    ...(loginResponse?.user.is_admin
      ? [
          {
            key: "sub4",
            label: "Admin",
            icon: (
              <Icon icon="eos-icons:admin-outlined" width="20" height="20" />
            ),
            children: [
              {
                key: "53",
                icon: (
                  <Icon icon="hugeicons:group-items" width="20" height="20" />
                ),
                label: "Stocks",
                onClick: () => {
                  router.push("/admin/stocks");
                },
              },
              {
                key: "50",
                icon: <Icon icon="mynaui:users" width="20" height="20" />,
                label: "Staffs",
                onClick: () => {
                  router.push("/admin/staffs");
                },
              },

              {
                key: "55",
                icon: (
                  <Icon icon="hugeicons:task-daily-01" width="20" height="20" />
                ),
                label: "Daily Gold Price",
                onClick: () => {
                  router.push("/admin/daily-gold-price");
                },
              },
              {
                key: "56",
                label: "Discounts",
                icon: <Icon icon="ic:outline-discount" width="20" />,

                onClick: () => {
                  router.push("/admin/discounts");
                },
              },
              {
                key: "51",
                icon: (
                  <Icon
                    icon="streamline:shopping-store-2-store-shop-shops-stores"
                    width="16"
                    height="16"
                  />
                ),
                label: "Stores",
                onClick: () => {
                  router.push("/admin/stores");
                },
              },
              {
                key: "52",
                icon: (
                  <Icon icon="oui:app-users-roles" width="20" height="20" />
                ),
                label: "Roles",
                onClick: () => {
                  router.push("/admin/roles");
                },
              },
            ],
          },
        ]
      : []),

    // {
    //   key: "41",
    //   icon: <Icon icon="mdi:report-line" width="20" height="20" />,
    //   label: "Reports",
    //   children: [
    //     {
    //       key: "41-1",
    //       label: "Sales List",
    //       onClick: () => {
    //         router.push("/reports/sales-list");
    //       },
    //     },
    //     {
    //       key: "41-2",
    //       label: "Transfer Summary",
    //       onClick: () => {
    //         router.push("/reports/transfer-summary");
    //       },
    //     },
    //   ],
    // },
    // {
    //   key: "42",
    //   icon: <Icon icon="mdi:report-line" width="20" height="20" />,
    //   label: "Reports",
    // },
  ];
  const supportItems: MenuItem[] = [
    {
      key: "100",
      icon: (
        <Icon icon="material-symbols:info-outline" width="20" height="20" />
      ),
      label: "Help",
      onClick: () => {
        router.push("/help");
      },
    },
    {
      key: "101",
      icon: <Icon icon="solar:user-linear" width="20" height="20" />,
      label: "Profile",
      onClick: () => {
        router.push("/profile");
      },
    },
  ];

  return (
    <div className="relative w-[280px] bg-white h-screen overflow-hidden">
      {/* Sidebar Header */}
      <div className="fixed top-0 w-[280px] z-50 bg-white border-b border-[#CED4DA] h-[86px]">
        <div className="flex justify-between gap-4 items-baseline px-5">
          <Image
            src={Logo}
            width={160}
            height={80}
            className="py-[21px]"
            alt={"Goldwise Logo"}
            sizes=""
          />

          <Icon
            onClick={handleOpenSideNavBar}
            icon="heroicons:x-mark"
            className="text-3xl lg:hidden relative bottom-6 right-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="mt-[100px] pb-[70px]">
        <div className="h-[calc(100vh-170px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-5 pb-10 pt-2 touch-auto">
          <p className="font-semibold">Main Menu</p>
          <Menu
            style={{ width: "100%", border: "none" }}
            selectedKeys={getActiveMenuKeys()}
            defaultOpenKeys={["sub1", "sub2", "sub3", "sub4"]}
            mode={"inline"}
            items={items}
          />
          <p className="font-semibold mt-32">USER</p>
          <Menu
            style={{ width: "100%", border: "none" }}
            selectedKeys={getActiveMenuKeys().filter((key) =>
              ["100", "101"].includes(key)
            )}
            mode={"inline"}
            items={supportItems}
          />
        </div>
      </div>
      <div className="absolute bottom-10 w-full left-0 px-5 ">
        <button
          onClick={() => {
            handleLogout();
          }}
          className="bg-red-400 text-white px-5 py-3 rounded-[8px] w-full"
        >
          Logout
        </button>
      </div>
      {/* Footer/Logout Section */}
    </div>
  );
};

export default Sidebar;
