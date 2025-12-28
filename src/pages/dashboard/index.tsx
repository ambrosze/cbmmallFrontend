import Header from "@/components/header";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetDashboardSummaryQuery } from "@/services/dashboardSummary";
import { UserResponseTopLevel } from "@/types/loginInUserType";
import { formatCurrency } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Card, Progress } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currentHour = dayjs().hour();
const getGreeting = () => {
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};
const index = () => {
  const [search, setSearch] = useState("");

  // const { profileData, isLoading } = useUserProfile();
  const [loginResponse, setLoginResponse] =
    useLocalStorage<UserResponseTopLevel | null>("authLoginResponse", null);
  const { data: dashboardData, isLoading: isLoadingDashboard } =
    useGetDashboardSummaryQuery({});

  const fullName = `${loginResponse?.user.first_name} ${loginResponse?.user.last_name}`;

  // Chart data preparation
  const salesData = [
    { name: "Total Sales", value: dashboardData?.data?.sales?.total || 0 },
    { name: "New Sales", value: dashboardData?.data?.sales?.new_sales || 0 },
  ];

  const productsSummary = dashboardData?.data?.products;
  const productsInventoryData = [
    {
      name: "Available",
      value: productsSummary?.available || 0,
      color: "#10b981",
    },
    {
      name: "Low Stock",
      value: productsSummary?.low_stock || 0,
      color: "#f59e0b",
    },
    {
      name: "Out of Stock",
      value: productsSummary?.out_of_stock?.length || 0,
      color: "#ef4444",
    },
  ];

  const userStaffData = [
    {
      name: "Users",
      total: dashboardData?.data?.users?.total || 0,
      active: dashboardData?.data?.users?.active || 0,
    },
    {
      name: "Staff",
      total: dashboardData?.data?.staff?.total || 0,
      active: dashboardData?.data?.staff?.active || 0,
    },
  ];

  const topSellingProducts = (
    dashboardData?.data?.products?.top_selling_products ?? []
  )
    .slice(0, 5)
    .map((product) => ({
      ...product,
      product_name:
        product.product_variant.product?.name || product.product_variant.name,
    }));

  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={false}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <SharedLayout>
        <div className="mt-24">
          <p className="text-[24px] font-semibold text-[#2C3137] capitalize">
            {getGreeting()}, {fullName}!
          </p>
          <p className="text-[16px]">
            Here is an overview of all your Activities
          </p>
        </div>

        <div className="flex flex-col gap-6 mt-5">
          {/* Stats Cards Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Today's Sale */}
            <Card className="border border-[#D0D3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#383E49] text-[16px] font-medium mb-2">
                    Total Sales Amount
                  </h3>
                  <p className="text-[#48505E] text-[24px] font-bold">
                    {isLoadingDashboard
                      ? "Loading..."
                      : formatCurrency(
                          dashboardData?.data?.sales?.total_amount || 0
                        )}
                  </p>
                  <p className="text-[#10b981] text-sm mt-1">
                    Avg:{" "}
                    {formatCurrency(
                      dashboardData?.data?.sales?.average_amount || 0
                    )}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Icon
                    icon="mdi:currency-usd"
                    className="w-6 h-6 text-green-600"
                  />
                </div>
              </div>
            </Card>

            {/* Total Sales Count */}
            <Card className="border border-[#D0D3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#383E49] text-[16px] font-medium mb-2">
                    Total Sales
                  </h3>
                  <p className="text-[#48505E] text-[24px] font-bold">
                    {isLoadingDashboard
                      ? "Loading..."
                      : dashboardData?.data?.sales?.total || 0}
                  </p>
                  <p className="text-[#3b82f6] text-sm mt-1">
                    New: {dashboardData?.data?.sales?.new_sales || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Icon icon="mdi:cart" className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Total Users */}
            <Card className="border border-[#D0D3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#383E49] text-[16px] font-medium mb-2">
                    Total Users
                  </h3>
                  <p className="text-[#48505E] text-[24px] font-bold">
                    {isLoadingDashboard
                      ? "Loading..."
                      : dashboardData?.data?.users?.total || 0}
                  </p>
                  <p className="text-[#8b5cf6] text-sm mt-1">
                    Active: {dashboardData?.data?.users?.active || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Icon
                    icon="mdi:account-group"
                    className="w-6 h-6 text-purple-600"
                  />
                </div>
              </div>
            </Card>

            {/* Total Products */}
            <Card className="border border-[#D0D3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#383E49] text-[16px] font-medium mb-2">
                    Total Products
                  </h3>
                  <p className="text-[#48505E] text-[24px] font-bold">
                    {isLoadingDashboard
                      ? "Loading..."
                      : dashboardData?.data?.products?.total || 0}
                  </p>
                  <p className="text-[#f59e0b] text-sm mt-1">
                    Available: {dashboardData?.data?.products?.available || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Icon
                    icon="mdi:package-variant"
                    className="w-6 h-6 text-amber-600"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Staff Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-[#D0D3D9] shadow-sm">
              <h3 className="text-[#2C3137] text-[18px] font-semibold mb-4">
                Staff Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">
                    Total Staff
                  </span>
                  <span className="text-[#667085] font-semibold">
                    {dashboardData?.data?.staff?.total || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">
                    Active Staff
                  </span>
                  <span className="text-[#10b981] font-semibold">
                    {dashboardData?.data?.staff?.active || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">New Staff</span>
                  <span className="text-[#3b82f6] font-semibold">
                    {dashboardData?.data?.staff?.new_staff || 0}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Active Rate</span>
                    <span className="text-sm font-medium">
                      {dashboardData?.data?.staff?.total
                        ? Math.round(
                            (dashboardData?.data?.staff?.active /
                              dashboardData?.data?.staff?.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    percent={
                      dashboardData?.data?.staff?.total
                        ? Math.round(
                            (dashboardData?.data?.staff?.active /
                              dashboardData?.data?.staff?.total) *
                              100
                          )
                        : 0
                    }
                    strokeColor="#10b981"
                    size="small"
                  />
                </div>
              </div>
            </Card>

            <Card className="border border-[#D0D3D9] shadow-sm">
              <h3 className="text-[#2C3137] text-[18px] font-semibold mb-4">
                User Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">
                    Total Users
                  </span>
                  <span className="text-[#667085] font-semibold">
                    {dashboardData?.data?.users?.total || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">
                    Active Users
                  </span>
                  <span className="text-[#10b981] font-semibold">
                    {dashboardData?.data?.users?.active || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">
                    New Signups
                  </span>
                  <span className="text-[#3b82f6] font-semibold">
                    {dashboardData?.data?.users?.new_signups || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2B2F38] font-medium">
                    Inactive Users
                  </span>
                  <span className="text-[#ef4444] font-semibold">
                    {dashboardData?.data?.users?.inactive || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Selling Items */}
            <Card className="border border-[#D0D3D9] shadow-sm lg:col-span-2">
              <h3 className="text-[#2C3137] text-[18px] font-semibold mb-4">
                Top Selling Items
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSellingProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="product_name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name === "sales_count" ? "Sales Count" : "Revenue",
                      ]}
                      labelFormatter={(label) => `Product: ${label}`}
                    />
                    <Bar
                      dataKey="sales_count"
                      fill="#3b82f6"
                      name="Sales Count"
                    />
                    <Bar
                      dataKey="total_revenue"
                      fill="#10b981"
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Inventory Distribution */}
            <Card className="border border-[#D0D3D9] shadow-sm">
              <h3 className="text-[#2C3137] text-[18px] font-semibold mb-4">
                Inventory Status
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productsInventoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productsInventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {productsInventoryData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Detailed Top Selling Items List */}
          <Card className="border border-[#D0D3D9] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#2C3137] text-[18px] font-semibold">
                Top Selling Items Details
              </h3>
              <Link
                href="/products"
                className="text-[#0F50AA] hover:opacity-70 hover:underline text-sm font-medium"
              >
                View All Items
              </Link>
            </div>
            <div className="space-y-3">
              {topSellingProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="mdi:diamond-stone"
                        className="w-5 h-5 text-blue-600"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#2B2F38]">
                        {item.product_variant.product?.name ||
                          item.product_variant.name}{" "}
                        - {item.product_variant.material}
                      </p>
                      <p className="text-sm text-[#667085]">
                        SKU: {item.product_variant.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2B2F38]">
                      {item.sales_count} sales
                    </p>
                    <p className="text-sm text-[#10b981] font-medium">
                      {formatCurrency(item.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User vs Staff Comparison Chart */}
          <Card className="border border-[#D0D3D9] shadow-sm mb-20">
            <h3 className="text-[#2C3137] text-[18px] font-semibold mb-4">
              Users vs Staff Analytics
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userStaffData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Total"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.8}
                    name="Active"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </SharedLayout>
    </div>
  );
};

export default index;
