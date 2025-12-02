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
    if (path.includes("/admin/stocks")) return ["53", "sub4"];
    if (path.includes("/admin/staffs")) return ["50", "sub4"];
    if (path.includes("/admin/daily-gold-price")) return ["55", "sub4"];
    if (path.includes("/admin/roles")) return ["52", "sub4"];
    if (path.includes("/admin/discounts")) return ["56", "sub4"];

    // Then check regular routes
    if (path.includes("/products/create")) return ["5", "sub1"];
    if (path.includes("/products/attributes")) return ["6", "sub1"];
    if (path.includes("/products/category")) return ["7", "sub1"];
    if (path.includes("/products/discounts")) return ["8", "sub1"];
    if (path.includes("/products")) return ["2", "sub1"];
    if (path.includes("/stock-transfer")) return ["4", "sub1"];
    if (path.includes("/scrapes")) return ["3", "sub1"];
    if (
      path.includes("/sales/sales-list") ||
      path.includes("/sales/sales-inventory")
    )
      return ["20", "sub2"];
    if (path.includes("/sales/pos")) return ["22", "sub2"];
    if (path.includes("/sales/orders")) return ["23", "sub2"];
    if (path.includes("/attributes/category")) return ["30", "sub3"];
    if (path.includes("/attributes/types")) return ["31", "sub3"];
    if (path.includes("/attributes/colours")) return ["32", "sub3"];
    if (path.includes("/help")) return ["100"];
    if (path.includes("/settings")) return ["101"];
    // stores
    if (path.includes("/stores/inventories")) return ["30", "sub3"];
    if (path.includes("/stores")) return ["31", "sub3"];
    // people
    if (path.includes("/people/customers")) return ["40", "sub5"];
    if (path.includes("/people/staffs")) return ["43", "sub5"];
    if (path.includes("/people/suppliers")) return ["41", "sub5"];
    if (path.includes("/people/users")) return ["42", "sub5"];
    if (path.includes("/people/roles")) return ["45", "sub5"];

    return ["1"]; // Default to dashboard
  };

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <Icon icon="mage:dashboard" width="28" height="28" />,
      label: <span className="font-[500]">Dashboard</span>,
      onClick: () => {
        router.push("/dashboard");
      },
    },

    {
      key: "sub1",
      label: <span className="font-[500]">Products</span>,
      icon: <Icon icon="fluent:box-24-regular" width="28" height="28" />,
      children: [
        {
          key: "5",
          label: "Create Product",
          icon: (
            <Icon icon="ic:outline-create-new-folder" width="20" height="20" />
          ),
          onClick: () => {
            router.push("/products/create");
          },
        },
        {
          key: "2",
          label: "All Products",
          icon: <Icon icon="mdi:package-variant" width="20" height="20" />,
          onClick: () => {
            router.push("/products");
          },
        },
        // {
        //   key: "3",
        //   label: "Scrapes",
        //   icon: <Icon icon="simple-icons:scrapy" width="20" height="20" />,
        //   onClick: () => {
        //     router.push("/scrapes");
        //   },
        // },
        {
          key: "4",
          label: "Stock transfer",
          icon: <Icon icon="mdi:transfer" width="20" height="20" />,
          onClick: () => {
            router.push("/stock-transfer");
          },
        },
        {
          key: "6",
          icon: (
            <Icon
              icon="flowbite:cell-attributes-outline"
              width="20"
              height="20"
            />
          ),
          label: <span className="">Attributes</span>,
          onClick: () => {
            router.push("/products/attributes");
          },
        },
        {
          key: "7",
          icon: <Icon icon="iconamoon:category-light" width="20" height="20" />,
          label: <span className="">Categories</span>,
          onClick: () => {
            router.push("/products/category");
          },
        },
        {
          key: "8",
          label: <span className="">Discounts</span>,
          icon: <Icon icon="ic:outline-discount" width="20" />,

          onClick: () => {
            router.push("/products/discounts");
          },
        },
        // { key: "4", label: "Awaiting Stock", onClick: () => {} },
        // { key: "5", label: "Return stock", onClick: () => {} },
      ],
    },

    {
      key: "sub3",
      label: "Stores",
      icon: <Icon icon="ant-design:shop-outlined" width="26" height="26" />,
      children: [
        {
          key: "30",
          label: "All Inventory",
          icon: <Icon icon="ic:round-inventory" width="20" height="20" />,
          onClick: () => {
            router.push("/stores/inventories");
          },
        },
        {
          key: "31",
          icon: <Icon icon="pepicons-pencil:list" width="20" height="20" />,
          label: "Stores",
          onClick: () => {
            router.push("/stores");
          },
        },
        // {
        //   key: "31",
        //   label: "Types",
        //   onClick: () => {
        //     router.push("/attributes/types");
        //   },
        // },
      ],
    },
    {
      key: "sub2",
      label: <span className="font-[500]">Sales</span>,
      icon: <Icon icon="mynaui:cart" width="28" height="28" />,
      children: [
        {
          key: "20",
          icon: <Icon icon="iconoir:home-sale" width="20" height="20" />,
          label: <span className="">Sales</span>,
          onClick: () => {
            router.push("/sales/sales-list");
          },
        },

        {
          key: "22",
          label: <span className="">Pos</span>,
          icon: <Icon icon="mdi:line-scan" width="20" height="20" />,
          onClick: () => {
            router.push("/sales/pos");
          },
        },
        {
          key: "23",
          label: <span className="">Orders</span>,
          icon: <Icon icon="lets-icons:order" width="20" height="20" />,
          onClick: () => {
            router.push("/sales/orders");
          },
        },
        // { key: "23", label: "Return Item" },
      ],
    },

    {
      key: "sub5",
      label: "People",
      icon: <Icon icon="mdi:account-group-outline" width="26" height="26" />,
      children: [
        {
          key: "40",
          label: "Customers",
          icon: <Icon icon="mdi:account-circle" width="20" height="20" />,
          onClick: () => {
            router.push("/people/customers");
          },
        },
        {
          key: "43",
          icon: <Icon icon="mynaui:users" width="20" height="20" />,
          label: <span className="">Staffs</span>,
          onClick: () => {
            router.push("/people/staffs");
          },
        },
        {
          key: "45",
          icon: <Icon icon="oui:app-users-roles" width="20" height="20" />,
          label: "Roles",
          onClick: () => {
            router.push("/people/roles");
          },
        },
        // {
        //   key: "41",
        //   icon: <Icon icon="mdi:account-circle" width="20" height="20" />,
        //   label: "Suppliers",
        //   onClick: () => {
        //     router.push("/people/suppliers");
        //   },
        // },
        // {
        //   key: "42",
        //   icon: <Icon icon="mdi:account-circle" width="20" height="20" />,
        //   label: "Users",
        //   onClick: () => {
        //     router.push("/people/users");
        //   },
        // },

        // {
        //   key: "31",
        //   label: "Types",
        //   onClick: () => {
        //     router.push("/attributes/types");
        //   },
        // },
      ],
    },



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
        <Icon icon="material-symbols:info-outline" width="28" height="28" />
      ),
      label: "Help",
      onClick: () => {
        router.push("/help");
      },
    },
    {
      key: "101",
      icon: <Icon icon="solar:user-linear" width="28" height="28" />,
      label: "Profile",
      onClick: () => {
        router.push("/profile");
      },
    },
  ];

  return (
    <div className="relative w-[280px] h-screen overflow-hidden bg-gradient-to-b from-white to-[#f6f8ff]">
      {/* Sidebar Header */}
      <div className="fixed top-0 w-[280px] z-50 bg-white/90 backdrop-blur border-b border-[#E5E7EB] h-[86px]">
        <div className="flex justify-between gap-4 items-baseline px-5">
          <Image
            src={Logo}
            width={200}
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
        <div className="h-[calc(100vh-170px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-4 lg:px-2 pb-10 pt-2 touch-auto pretty-sidebar">
          <div className="bg-white/80 backdrop-blur rounded-xl border border-gray-100 shadow-f1 p-1">
            <Menu
              className="pretty-menu"
              style={{ width: "100%", border: "none" }}
              selectedKeys={getActiveMenuKeys()}
              defaultOpenKeys={["sub1", "sub2", "sub3", "sub4"]}
              mode={"inline"}
              items={items}
            />
          </div>
          <div className="mt-6 mb-2 px-1">
            <span className="text-[11px] tracking-wider text-gray-500 font-semibold">
              USER
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl border border-gray-100 shadow-f1 p-1">
            <Menu
              className="pretty-menu"
              style={{ width: "100%", border: "none" }}
              selectedKeys={getActiveMenuKeys().filter((key) =>
                ["100", "101"].includes(key)
              )}
              mode={"inline"}
              items={supportItems}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 w-full left-0 px-5 ">
        <button
          onClick={() => {
            handleLogout();
          }}
          className="w-full px-5 py-3 rounded-xl text-white bg-gradient-to-r from-rose-500 to-red-500 shadow-md hover:shadow-lg transition-shadow"
        >
          Logout
        </button>
      </div>
      {/* Footer/Logout Section */}
    </div>
  );
};

export default Sidebar;
