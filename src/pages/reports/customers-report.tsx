import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllCustomersReportQuery } from "@/services/reports";
import { formatCurrency, formatPhoneNumber, formatPhoneNumberWithCountryCode } from "@/utils/fx";
import {
  CalendarOutlined,
  ClearOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  UpOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// --- Helper Components ---

const StatCard = ({ title, value, prefix, color, icon, isCurrency }: any) => (
  <Card
    className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 h-full group"
    style={{
      background: `linear-gradient(135deg, ${color}08 0%, ${color}02 100%)`,
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

// --- Main Component ---

const CustomerReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    limit: 50, // Keep default limit for initial load if needed
  });

  const { data, isLoading, refetch } = useGetAllCustomersReportQuery({
    filter,
  });

  // --- Derived Data Calculations & Segmentation ---
  const { summaryStats, transformedData, segmentationData } = useMemo(() => {
    const rawCustomers = data?.data?.customers || [];

    // 1. Calculate Aggregates
    const stats = rawCustomers.reduce(
      (acc: any, curr: any) => ({
        totalCustomers: acc.totalCustomers + 1,
        totalRevenue: acc.totalRevenue + curr.total_spent,
        totalPurchases: acc.totalPurchases + curr.purchase_count,
        averageOrderValueOverall: acc.averageOrderValueOverall || 0,
      }),
      { totalCustomers: 0, totalRevenue: 0, totalPurchases: 0, averageOrderValueOverall: 0 }
    );

    stats.averageOrderValueOverall =
      stats.totalPurchases > 0 ? stats.totalRevenue / stats.totalPurchases : 0;

    // 2. Data Transformation (Simple)
    const transformed = rawCustomers.map((cust: any) => ({
      ...cust,
      isWalkIn: cust.name.toLowerCase().includes("walk-in"),
    }));

    // 3. Simple Segmentation (High/Low Spenders)
    // Threshold: Calculate the mean of non-zero spenders, or use a fixed value.
    const spendingCustomers = rawCustomers.filter(
      (c: any) => c.total_spent > 0
    );
    const meanRevenue =
      spendingCustomers.length > 0
        ? stats.totalRevenue / spendingCustomers.length
        : 100000;
    const HIGH_SPENDER_THRESHOLD = meanRevenue * 1.5; // Example: 150% of mean

    const highSpenders = transformed.filter(
      (c: any) => c.total_spent >= HIGH_SPENDER_THRESHOLD
    );
    const lowSpenders = transformed.filter(
      (c: any) => c.total_spent < HIGH_SPENDER_THRESHOLD && c.total_spent > 0
    );
    const noOrders = transformed.filter((c: any) => c.purchase_count === 0);

    const segmentColors = {
      "Top Spenders": "#10B981", // Emerald
      "Regular Customers": "#3B82F6", // Blue
      "No Orders": "#F59E0B", // Amber
    };

    const segmentation = [
      {
        name: "Top Spenders",
        value: highSpenders.length,
        color: segmentColors["Top Spenders"],
        totalSpent: highSpenders.reduce((acc, c) => acc + c.total_spent, 0),
      },
      {
        name: "Regular Customers",
        value: lowSpenders.length,
        color: segmentColors["Regular Customers"],
        totalSpent: lowSpenders.reduce((acc, c) => acc + c.total_spent, 0),
      },
      {
        name: "No Orders",
        value: noOrders.length,
        color: segmentColors["No Orders"],
        totalSpent: 0,
      },
    ].filter((s) => s.value > 0);

    return {
      summaryStats: stats,
      transformedData: transformed,
      segmentationData: segmentation,
    };
  }, [data]);

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setFilter((prev) => ({
      ...prev,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
    }));
  };

  const clearFilters = () => {
    setFilter({ start_date: "", end_date: "", limit: 50 });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;

  // --- Table Columns ---
  const columns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-purple-100 text-purple-600 font-bold">
            {text?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{text}</div>
            <div className="text-xs text-gray-500">{record.email || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact / Location",
      key: "contact",
      width: 150,
      render: (record: any) => (
        <div className="text-xs text-gray-600 space-y-1">
          <div>{formatPhoneNumber(record.phone_number) || "No Phone"}</div>
          <div>
            {record.city && <Tag color="blue">{record.city}</Tag>}
            {record.isWalkIn && <Tag color="volcano">Walk-In</Tag>}
          </div>
        </div>
      ),
    },
    {
      title: "Orders",
      dataIndex: "purchase_count",
      key: "purchase_count",
      align: "center" as const,
      sorter: (a: any, b: any) => a.purchase_count - b.purchase_count,
      render: (count: number) => (
        <span className="font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs">
          {count}
        </span>
      ),
    },
    {
      title: "Avg. Order Value",
      dataIndex: "average_order_value",
      key: "average_order_value",
      align: "right" as const,
      sorter: (a: any, b: any) => a.average_order_value - b.average_order_value,
      render: (val: number) => (
        <span className="text-gray-500 text-sm">{formatCurrency(val)}</span>
      ),
    },
    {
      title: "Total Spent",
      dataIndex: "total_spent",
      key: "total_spent",
      align: "right" as const,
      width: 240,
      sorter: (a: any, b: any) => a.total_spent - b.total_spent,
      defaultSortOrder: "descend" as const,
      render: (val: number) => (
        <Text strong className="text-emerald-600 text-base">
          {formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: "Joined Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (dateString: string) => (
        <Tag color="default" icon={<CalendarOutlined />}>
          {dayjs(dateString).format("MMM DD, YYYY")}
        </Tag>
      ),
    },
  ];

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 border-0 shadow-xl rounded-lg">
          <p className="font-bold text-gray-800 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Customers: <span className="font-semibold">{data.value}</span>
          </p>
          {data.totalSpent > 0 && (
            <p className="text-sm text-emerald-600 font-medium">
              Revenue: {formatCurrency(data.totalSpent)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

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
        headerText="Customer Analytics Report"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-customers">
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
                <Col xs={24} sm={16} lg={12}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    Customer Registration Period
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
                <Col xs={24} sm={8} lg={4}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block flex items-center gap-2">
                    <UsergroupAddOutlined className="text-blue-500" />
                    Max Records
                  </label>
                  <div className="text-lg font-bold text-gray-700">
                    {filter.limit || "All"}
                  </div>
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
          ) : transformedData.length === 0 ? (
            <Empty
              description="No customer data available in this report"
              className="mt-20"
            />
          ) : (
            <div className="space-y-8">
              {/* --- 1. High Level Stats --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={6}>
                  <StatCard
                    title="Total Customers"
                    value={summaryStats.totalCustomers}
                    color="#8B5CF6" // Purple
                    icon={
                      <UsergroupAddOutlined className="text-white text-xl" />
                    }
                    isCurrency={false}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <StatCard
                    title="Total Revenue (All Time)"
                    value={summaryStats.totalRevenue}
                    color="#10B981" // Emerald
                    icon={<DollarOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <StatCard
                    title="Total Orders Placed"
                    value={summaryStats.totalPurchases}
                    color="#3B82F6" // Blue
                    icon={
                      <ShoppingCartOutlined className="text-white text-xl" />
                    }
                    isCurrency={false}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <StatCard
                    title="Avg. Order Value"
                    value={summaryStats.averageOrderValueOverall}
                    color="#F59E0B" // Amber
                    icon={<SolutionOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
              </Row>

              {/* --- 2. Visualization & Table Layout --- */}
              <Row gutter={[24, 24]}>
                {/* Chart Section */}
                <Col xs={24} lg={8}>
                  <Card className="rounded-2xl border-0 bg-white/90 h-full">
                    <Title level={4} className="mb-4 text-gray-700">
                      Customer Segmentation
                    </Title>
                    <div style={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={segmentationData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            labelLine={false}
                            paddingAngle={5}
                            isAnimationActive={false}
                          >
                            {segmentationData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={entry.color}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Table Section */}
                <Col xs={24} lg={16}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <UserOutlined className="text-blue-600" />
                        <span>Customer Details & Spending Ranks</span>
                      </div>
                    }
                    className="rounded-2xl border-0 bg-white/90 h-full"
                    bodyStyle={{ padding: 0 }} // Remove default padding since Table has its own
                  >
                    <Table
                      columns={columns}
                      dataSource={transformedData}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      className="modern-table"
                      scroll={{ x: 900 }}
                    />
                  </Card>
                </Col>
              </Row>
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

export default CustomerReport;
