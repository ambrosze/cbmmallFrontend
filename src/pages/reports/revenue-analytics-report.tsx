import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllEnumsQuery } from "@/services/global";
import { useGetAllRevenueAnalyticsReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  AreaChartOutlined,
  CalendarOutlined,
  ClearOutlined,
  DollarCircleOutlined,
  DownOutlined,
  FilterOutlined,
  LineChartOutlined,
  ReloadOutlined,
  RiseOutlined,
  TransactionOutlined,
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
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
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

// --- Helper Functions and Constants ---

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

const StatCard = ({
  title,
  value,
  prefix,
  color,
  icon,
  isCurrency,
  suffix,
}: any) => (
  <Card
    className="relative overflow-hidden shadow hover:shadow-lg transition-all duration-300 border-0 h-full group"
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
      </div>
      <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
        {title}
      </Text>
      <Statistic
        value={value}
        prefix={prefix}
        suffix={suffix}
        precision={isCurrency ? 2 : 0}
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

// Custom Tooltip for Charts
const CustomRevenueTooltip = ({
  active,
  payload,
  label,
  isCurrency = true,
}: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const totalRevenue = data.revenue;
    const paymentMethod = data.payment_method || data.name;

    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border-0 shadow-xl rounded-xl">
        <p className="font-bold text-gray-800 mb-1">{label || paymentMethod}</p>
        <p className="text-emerald-600 font-semibold m-0 text-sm">
          Revenue:{" "}
          <span className="font-bold">{formatCurrency(totalRevenue)}</span>
        </p>
        {data.sales_count && (
          <p className="text-blue-500 font-medium m-0 text-xs mt-1">
            Sales Count: {data.sales_count}
          </p>
        )}
        {data.count && (
          <p className="text-blue-500 font-medium m-0 text-xs mt-1">
            Transactions: {data.count}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// --- Main Component ---

const RevenueAnalyticsReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    period: "",
  });

  const {
    data: reportData,
    isLoading: isReportLoading,
    isFetching: isReportFetching,
    refetch,
  } = useGetAllRevenueAnalyticsReportQuery({ filter });

  // Fetch time period enums
  const { data: enumsData, isLoading: isEnumsLoading } = useGetAllEnumsQuery({
    enum: "TimePeriod",
  });
  const timePeriodOptions = enumsData?.values || [];

  const { summaryStats, timeSeriesData, paymentData } = useMemo(() => {
    const revenueByPeriod = reportData?.data?.revenue_by_period || [];
    const revenueByPayment = reportData?.data?.revenue_by_payment_method || [];
    const growthRate = reportData?.data?.growth_rate || 0;

    // 1. Calculate Aggregates
    const totalRevenue = revenueByPeriod.reduce(
      (acc: number, curr: any) => acc + parseFloat(curr.revenue),
      0
    );

    // 2. Format Time Series Data for Chart
    const formattedTimeSeries = revenueByPeriod.map((item: any) => ({
      ...item,
      revenue: parseFloat(item.revenue),
      subtotal: parseFloat(item.subtotal),
      tax: parseFloat(item.tax),
      discount: parseFloat(item.discount),
    }));

    // 3. Format Payment Data for Chart (Donut Chart requires 'name' and 'value')
    const formattedPaymentData = revenueByPayment
      .map((item: any) => ({
        name: item.payment_method,
        value: parseFloat(item.revenue),
        revenue: parseFloat(item.revenue),
        count: item.count,
      }))
      .filter((item) => item.value > 0);

    // 4. Calculate Total Revenue percentage distribution for payment data
    const totalPaymentRevenue = formattedPaymentData.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const paymentDataWithPercentage = formattedPaymentData.map((item) => ({
      ...item,
      percentage:
        totalPaymentRevenue > 0 ? (item.value / totalPaymentRevenue) * 100 : 0,
    }));

    return {
      summaryStats: {
        totalRevenue,
        growthRate,
      },
      timeSeriesData: formattedTimeSeries,
      paymentData: paymentDataWithPercentage,
    };
  }, [reportData]);

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
    setFilter({ start_date: "", end_date: "", period: "" });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;
  const isLoading = isReportLoading || isEnumsLoading;

  // --- Table Columns for Revenue by Period ---
  const periodColumns = [
    {
      title: filter.period || "Period",
      dataIndex: "period",
      key: "period",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Sales Count",
      dataIndex: "sales_count",
      key: "sales_count",
      align: "right" as const,
      sorter: (a: any, b: any) => a.sales_count - b.sales_count,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      align: "right" as const,
      render: (val: number) => formatCurrency(val, "en-NG", "NGN"),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      align: "right" as const,
      render: (val: number) => formatCurrency(val, "en-NG", "NGN"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-red-500">
          {formatCurrency(val, "en-NG", "NGN")}
        </span>
      ),
    },
    {
      title: "Total Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "right" as const,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      defaultSortOrder: "descend" as const,
      render: (val: number) => (
        <Text strong className="text-emerald-600 text-base">
          {formatCurrency(val, "en-NG", "NGN")}
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
        placeHolderText="Analyze financial metrics"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Revenue Analytics Report"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-financial">
          {/* --- Filters Button --- */}
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
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    Custom Date Range
                  </label>
                  <RangePicker
                    className="w-full rounded-lg shadow-sm"
                    onChange={handleDateChange}
                    size="large"
                    value={
                      filter.start_date
                        ? [dayjs(filter.start_date), dayjs(filter.end_date)]
                        : null
                    }
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
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
                    size="large"
                    loading={isEnumsLoading}
                  >
                    {timePeriodOptions.map((period) => (
                      <Option key={period.value} value={period.value}>
                        {period.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div className="flex gap-2">
                    <Button
                      size="large"
                      icon={<ClearOutlined />}
                      onClick={clearFilters}
                      className="flex-1 rounded-lg"
                    >
                      Clear
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ReloadOutlined />}
                      onClick={() => refetch()}
                      className="flex-1 rounded-lg"
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
          ) : summaryStats.totalRevenue === 0 && timeSeriesData.length === 0 ? (
            <Empty
              description="No revenue data available for the selected filters"
              className="mt-20"
            />
          ) : (
            <div className="space-y-8">
              {/* --- 1. Key Performance Indicators (KPIs) --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={12}>
                  <StatCard
                    title="Total Revenue"
                    value={summaryStats.totalRevenue}
                    color="#10B981"
                    icon={
                      <DollarCircleOutlined className="text-white text-xl" />
                    }
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <StatCard
                    title="Growth Rate vs. Previous Period"
                    value={summaryStats.growthRate}
                    color={summaryStats.growthRate >= 0 ? "#3B82F6" : "#EF4444"}
                    icon={<RiseOutlined className="text-white text-xl" />}
                    isCurrency={false}
                    suffix="%"
                  />
                </Col>
              </Row>

              {/* --- 2. Charts: Time Series and Payment Breakdown --- */}
              <Row gutter={[24, 24]}>
                {/* Revenue Trend Chart */}
                <Col xs={24} lg={14}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <LineChartOutlined className="text-blue-600" /> Revenue
                        Trend & Sales Count
                      </div>
                    }
                    className=" rounded-2xl border-0 bg-white/90 h-full"
                  >
                    <div style={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart // Using ComposedChart to combine Bar and Line
                          data={timeSeriesData}
                          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="period"
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          {/* Y-Axis for Revenue (Left Side - Bar) */}
                          <YAxis
                            yAxisId="revenue"
                            orientation="left"
                            tickFormatter={(value) =>
                              `${formatCurrency(value)}`
                            }
                            tick={{ fontSize: 12, fill: "#10B981" }}
                            axisLine={false}
                            tickLine={false}
                            stroke="#10B981"
                          />
                          {/* Y-Axis for Sales Count (Right Side - Line) */}
                          <YAxis
                            yAxisId="sales"
                            orientation="right"
                            tick={{ fontSize: 12, fill: "#3B82F6" }}
                            axisLine={false}
                            tickLine={false}
                            stroke="#3B82F6"
                          />
                          <Tooltip content={<CustomRevenueTooltip />} />
                          <Legend
                            wrapperStyle={{ paddingTop: "10px" }}
                            iconType="circle"
                          />

                          {/* Bar for Total Revenue */}
                          <Bar
                            yAxisId="revenue"
                            dataKey="revenue"
                            fill="#10B981A0" // Emerald with transparency
                            name="Revenue"
                            barSize={20}
                            radius={[4, 4, 0, 0]}
                          />

                          {/* Line for Sales Count */}
                          <Line
                            yAxisId="sales"
                            type="monotone"
                            dataKey="sales_count"
                            stroke="#3B82F6" // Blue
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                            name="Sales Count"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Payment Method Breakdown Chart */}
                <Col xs={24} lg={10}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <TransactionOutlined className="text-blue-600" />{" "}
                        Revenue by Payment Method
                      </div>
                    }
                    className=" rounded-2xl border-0 bg-white/90 h-full"
                  >
                    <div style={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={110}
                            paddingAngle={3}
                            fill="#8884d8"
                            isAnimationActive={false}
                          >
                            {paymentData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomRevenueTooltip />} />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* --- 3. Detailed Data Table (Revenue by Period) --- */}
              {timeSeriesData.length > 0 && (
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-blue-600" />
                      <span>
                        Detailed Revenue Breakdown{" "}
                        {filter.period && `(${filter.period})`}
                      </span>
                    </div>
                  }
                  className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
                  bodyStyle={{ padding: 0 }}
                >
                  <Table
                    columns={periodColumns}
                    dataSource={timeSeriesData}
                        rowKey="period"
                        loading={isReportLoading || isReportFetching}
                    pagination={{ pageSize: 10 }}
                    className="modern-table"
                    scroll={{ x: 800 }}
                  />
                </Card>
              )}
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
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default RevenueAnalyticsReport;
