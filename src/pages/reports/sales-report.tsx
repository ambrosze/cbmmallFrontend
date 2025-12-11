import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllStaffQuery } from "@/services/admin/staff";
import { useGetAllEnumsQuery } from "@/services/global";
import { useGetAllSalesReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  AreaChartOutlined,
  CalendarOutlined,
  ClearOutlined,
  CreditCardOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Select,
  Statistic,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

// --- Enhanced Stat Card ---
const StatCard = ({
  title,
  value,
  prefix,
  color,
  icon,
  isCurrency,
  trend,
}: any) => (
  <Card
    className="relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-0 h-full group"
    style={{
      background: `linear-gradient(135deg, ${color}08 0%, ${color}09 100%)`,
    }}
  >
    <div
      className="absolute top-0 right-0 w-32 h-32 opacity-5 transition-opacity group-hover:opacity-10"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
        {title}
      </Text>
      <Statistic
        value={value}
        prefix={prefix}
        formatter={(val) => (isCurrency ? formatCurrency(Number(val)) : val)}
        valueStyle={{
          fontWeight: 700,
          fontSize: "1.75rem",
          color: "#1F2937",
        }}
      />
    </div>
  </Card>
);

const CustomChartTooltip = ({ active, payload, label, isCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border-0 shadow-2xl rounded-xl">
        <p className="font-bold text-gray-800 mb-2 text-sm">{label}</p>
        <p className="text-blue-600 font-semibold m-0">
          {isCurrency
            ? formatCurrency(payload[0].value)
            : `${payload[0].value} transactions`}
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---
const SalesReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState<string>("");
  console.log("🚀 ~ SalesReport ~ search:", search);
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    period: "day",
    payment_method: "",
    cashier_staff_id: "",
  });

  const { data, isLoading, refetch, isFetching } = useGetAllSalesReportQuery({
    filter,
  });
  const { data: staffList, isLoading: isStaffLoading } = useGetAllStaffQuery({
    include: "user",
    q: search,
  });
  const { data: paymentMethodsData, isLoading: isPaymentMethodsLoading } =
    useGetAllEnumsQuery({ enum: "PaymentMethod" });

  const { data: timePeriodsData, isLoading: isTimePeriodsLoading } =
    useGetAllEnumsQuery({ enum: "TimePeriod" });

  const timePeriodOptions = timePeriodsData?.values || [];
  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setFilter((prev) => ({
      ...prev,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilter({
      start_date: "",
      end_date: "",
      period: "day",
      cashier_staff_id: "",
      payment_method: "",
    });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;

  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoice_number",
      key: "invoice_number",
      render: (text: string) => (
        <Text strong className="text-blue-600">
          {text}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: string) => (
        <span className="text-gray-600 text-sm">
          {dayjs(val).format("DD MMM YYYY, HH:mm")}
        </span>
      ),
    },
    {
      title: "Cashier",
      dataIndex: ["cashier", "name"],
      key: "cashier",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
            {name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: "Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (val: string) => {
        const methodConfig: any = {
          CASH: { color: "#10B981", bg: "#D1FAE5" },
          TRANSFER: { color: "#3B82F6", bg: "#DBEAFE" },
          POS: { color: "#F59E0B", bg: "#FEF3C7" },
        };
        const config = methodConfig[val] || { color: "#6B7280", bg: "#F3F4F6" };
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            {val}
          </span>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total_price",
      key: "total_price",
      align: "right" as const,
      render: (val: number) => (
        <Text strong className="text-lg" style={{ color: "#10B981" }}>
          {formatCurrency(val)}
        </Text>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header
        search=""
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Search customers"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Sales Analytics"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-sales">
          {/* --- Modern Filter Toggle --- */}
          <div className="mb-6">
            <Button
              size="large"
              onClick={() => setShowFilters(!showFilters)}
              className="shadow-md hover:shadow-lg transition-all duration-300 border-0 font-semibold"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                color: "white",
              }}
              icon={<FilterOutlined />}
            >
              <span className="flex items-center gap-2">
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
                {showFilters ? <UpOutlined /> : <DownOutlined />}
              </span>
            </Button>
          </div>

          {/* --- Collapsible Filters --- */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showFilters ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"
            }`}
          >
            <Card className="shadow-lg rounded-2xl border-0 bg-white/80 backdrop-blur-sm">
              <Row gutter={[24, 24]} align="bottom">
                <Col xs={24} sm={12} lg={8}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3  flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    Date Range
                  </label>
                  <RangePicker
                    className="w-full rounded-lg shadow-sm border-gray-200 hover:border-blue-400 transition-colors"
                    onChange={handleDateChange}
                    value={
                      filter.start_date
                        ? [dayjs(filter.start_date), dayjs(filter.end_date)]
                        : null
                    }
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Cashier
                  </label>
                  <Select
                    className="w-full rounded-lg"
                    placeholder="Select cashier"
                    loading={isStaffLoading}
                    value={filter.cashier_staff_id || undefined}
                    onChange={(val) =>
                      handleFilterChange("cashier_staff_id", val)
                    }
                    allowClear
                    showSearch
                    filterOption={false}
                    onSearch={setSearch}
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                    options={
                      staffList?.data?.map((item: any) => {
                        console.log("🚀 ~ StaffPerformance ~ item:", item);
                        return {
                          label:
                            item.user?.first_name + " " + item?.user.last_name,
                          value: item.id,
                        };
                      }) || []
                    }
                  />
                </Col>
                <Col xs={24} sm={12} lg={5}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <AreaChartOutlined className="text-blue-500" />
                    Group By Period
                  </label>
                  <Select
                    className="w-full"
                    placeholder="Select Period (e.g., Monthly)"
                    value={filter.period || undefined}
                    onChange={(val) => handleFilterChange("period", val)}
                    allowClear
                    showSearch
                    size="large"
                    loading={isTimePeriodsLoading}
                  >
                    {timePeriodOptions.map((period) => (
                      <Option key={period.value} value={period.value}>
                        {period.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Payment Method
                  </label>
                  <Select
                    className="w-full rounded-lg"
                    placeholder="All methods"
                    loading={isPaymentMethodsLoading}
                    value={filter.payment_method || undefined}
                    onChange={(val) =>
                      handleFilterChange("payment_method", val)
                    }
                    allowClear
                    showSearch
                    size="large"
                    suffixIcon={<CreditCardOutlined />}
                  >
                    {paymentMethodsData?.values?.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                  <div className="flex gap-2">
                    <Button
                      size="large"
                      icon={<ClearOutlined />}
                      onClick={clearFilters}
                      className="flex-1 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      Clear
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ReloadOutlined />}
                      onClick={() => refetch()}
                      className="flex-1 rounded-lg shadow-md hover:shadow-lg transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        border: "none",
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <div className="space-y-8">
              {/* --- Enhanced Summary Stats --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Total Sales Count"
                    value={data?.data?.summary?.total_sales}
                    color="#3B82F6"
                    icon={
                      <ShoppingCartOutlined className="text-white text-xl" />
                    }
                    isCurrency={false}
                    trend={12}
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Total Revenue"
                    value={data?.data?.summary?.total_revenue}
                    color="#10B981"
                    icon={<DollarOutlined className="text-white text-xl" />}
                    isCurrency={true}
                    trend={8}
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Avg. Order Value"
                    value={data?.data?.summary?.average_order_value}
                    color="#F59E0B"
                    icon={<RiseOutlined className="text-white text-xl" />}
                    isCurrency={true}
                    trend={5}
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Discounts Given"
                    value={data?.data?.summary?.total_discount}
                    color="#EF4444"
                    icon={<TagOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
              </Row>

              {/* --- Enhanced Visualizations --- */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card className=" rounded-2xl border-0 h-full bg-white/90 ">
                    <div className="mb-6">
                      <Title level={4} className="mb-1">
                        Revenue Trend
                      </Title>
                      <Text className="text-sm text-gray-500">
                        Revenue performance over selected period
                      </Text>
                    </div>
                    <div style={{ height: 380 }}>
                      {data?.data?.sales_by_period?.length! > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={data?.data?.sales_by_period}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#3B82F6"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#3B82F6"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#E5E7EB"
                            />
                            <XAxis
                              dataKey="period"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#6B7280",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: "#6B7280",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                              tickFormatter={(val) => `${val / 1000}k`}
                            />
                            <Tooltip
                              content={<CustomChartTooltip isCurrency />}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#3B82F6"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No trend data available"
                        />
                      )}
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  <Card className="rounded-2xl border-0 h-full bg-white/90 ">
                    <div className="mb-4">
                      <Title level={4} className="mb-1">
                        Payment Breakdown
                      </Title>
                      <Text className="text-sm text-gray-500">
                        Distribution by method
                      </Text>
                    </div>
                    <div style={{ height: 380 }}>
                      {data?.data?.payment_method_breakdown?.length! > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data?.data?.payment_method_breakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="count"
                              nameKey="payment_method"
                            >
                              {data?.data?.payment_method_breakdown.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              content={<CustomChartTooltip label={true} />}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              wrapperStyle={{
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No data available"
                        />
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* --- Enhanced Transaction Table --- */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <Title level={4} style={{ margin: 0 }}>
                      Recent Transactions
                    </Title>
                    <Text className="text-sm text-gray-500">
                      Last {data?.data?.recent_sales?.length || 0} transactions
                    </Text>
                  </div>
                }
                className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
              >
                <Table
                  columns={columns}
                  dataSource={data?.data?.recent_sales}
                  rowKey="id"
                  loading={isLoading || isFetching}
                  pagination={{
                    pageSize: 8,
                    showTotal: (total) => `Total ${total} transactions`,
                  }}
                  scroll={{ x: 700 }}
                  className="modern-table"
                />
              </Card>
            </div>
          )}
        </PermissionGuard>
      </SharedLayout>

      <style>{`
        .modern-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%) !important;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #E5E7EB !important;
        }
        .modern-table .ant-table-tbody > tr:hover > td {
          background: #F0F9FF !important;
        }
        .modern-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #F3F4F6 !important;
          padding: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default SalesReport;
