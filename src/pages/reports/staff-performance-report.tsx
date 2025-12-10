import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllStaffQuery } from "@/services/admin/staff";
import { useGetAllStaffPerformanceReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  CalendarOutlined,
  ClearOutlined,
  CrownOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  ShopOutlined,
  TeamOutlined,
  TrophyOutlined,
  UpOutlined,
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
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

// --- Components ---

const StatCard = ({ title, value, prefix, color, icon, isCurrency }: any) => (
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

const TopPerformerCard = ({ staff, rank }: { staff: any; rank?: number }) => {
  if (!staff) return null;

  const colorsMap: Record<
    number,
    { bg: string; shadow: string; icon?: JSX.Element }
  > = {
    1: {
      bg: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-200",
      icon: <CrownOutlined />,
    },
    2: {
      bg: "from-gray-300 to-gray-400",
      shadow: "shadow-gray-200",
      icon: <TrophyOutlined />,
    },
    3: {
      bg: "from-orange-300 to-red-400",
      shadow: "shadow-orange-200",
      icon: <TrophyOutlined />,
    },
  };

  const colors = colorsMap[typeof rank === "number" ? rank : -1] || {
    bg: "from-blue-400 to-blue-500",
    shadow: "shadow-blue-200",
  };

  return (
    <Card className="border-0  relative overflow-hidden h-full transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative mb-3">
          <Avatar
            size={80}
            className={`border-4 border-white shadow-lg bg-gray-200 text-2xl font-bold`}
            src={staff.staff.avatar}
          >
            {staff.staff.name?.charAt(0)}
          </Avatar>
          <div
            className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-r ${colors.bg}`}
          >
            {rank}
          </div>
        </div>

        <Title level={5} className="m-0 mb-1">
          {staff.staff.name}
        </Title>
        <Text type="secondary" className="text-xs mb-4">
          {staff.staff.store}
        </Text>

        <div className="w-full grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl">
          <div className="text-center">
            <Text className="text-xs text-gray-500 block">Revenue</Text>
            <Text strong className="text-green-600">
              {formatCurrency(staff.performance.total_revenue)}
            </Text>
          </div>
          <div className="text-center border-l border-gray-200">
            <Text className="text-xs text-gray-500 block">Sales</Text>
            <Text strong className="text-blue-600">
              {staff.performance.sales_count}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border-0 shadow-xl rounded-xl">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-emerald-600 font-semibold m-0 text-sm">
          Revenue: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-blue-500 font-medium m-0 text-xs mt-1">
          Sales Count: {payload[0].payload.count}
        </p>
      </div>
    );
  }
  return null;
};

const StaffPerformance = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    staff_id: "",
  });

  const { data, isLoading, refetch, isFetching } =
    useGetAllStaffPerformanceReportQuery({
      filter,
    });
  const { data: staffList, isLoading: isStaffLoading } = useGetAllStaffQuery({
    include: "user",
  });

  // --- Derived Data Calculations ---
  const { summaryStats, sortedData, topThree, chartData } = useMemo(() => {
    const rawData = data?.data?.staff_performance || [];

    // 1. Calculate Aggregates
    const stats = rawData.reduce(
      (acc: any, curr: any) => ({
        totalRevenue: acc.totalRevenue + curr.performance.total_revenue,
        totalSales: acc.totalSales + curr.performance.sales_count,
      }),
      { totalRevenue: 0, totalSales: 0 }
    );

    // 2. Sort by Revenue for Leaderboard
    const sorted = [...rawData].sort(
      (a, b) => b.performance.total_revenue - a.performance.total_revenue
    );

    // 3. Chart Data (Top 10 to avoid clutter)
    const chart = sorted.slice(0, 10).map((item) => ({
      name: item.staff.name.split(" ")[0], // First name only for chart
      fullName: item.staff.name,
      revenue: item.performance.total_revenue,
      count: item.performance.sales_count,
    }));

    return {
      summaryStats: stats,
      sortedData: sorted,
      topThree: sorted.slice(0, 3),
      chartData: chart,
    };
  }, [data]);

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
    setFilter({ start_date: "", end_date: "", staff_id: "" });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;

  // --- Table Columns ---
  const columns = [
    {
      title: "Rank",
      key: "rank",
      width: 80,
      render: (_: any, __: any, index: number) => {
        const rank = index + 1;
        if (rank === 1)
          return <CrownOutlined className="text-yellow-500 text-lg" />;
        if (rank === 2)
          return <span className="text-gray-400 font-bold text-lg">#2</span>;
        if (rank === 3)
          return <span className="text-orange-400 font-bold text-lg">#3</span>;
        return <span className="text-gray-400 font-medium">#{rank}</span>;
      },
    },
    {
      title: "Staff Member",
      dataIndex: "staff",
      key: "staff",
      render: (staff: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-blue-100 text-blue-600 font-bold">
            {staff.name?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{staff.name}</div>
            <div className="text-xs text-gray-500">{staff.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Store",
      dataIndex: ["staff", "store"],
      key: "store",
      render: (store: string) => (
        <Tag icon={<ShopOutlined />} className="rounded-full px-2">
          {store}
        </Tag>
      ),
    },
    {
      title: "Sales Count",
      dataIndex: ["performance", "sales_count"],
      key: "sales_count",
      align: "center" as const,
      sorter: (a: any, b: any) =>
        a.performance.sales_count - b.performance.sales_count,
      render: (count: number) => (
        <span className="font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs">
          {count} Orders
        </span>
      ),
    },
    {
      title: "Avg. Transaction",
      dataIndex: ["performance", "average_transaction_value"],
      key: "atv",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-gray-500 text-sm">{formatCurrency(val)}</span>
      ),
    },
    {
      title: "Total Revenue",
      dataIndex: ["performance", "total_revenue"],
      key: "total_revenue",
      align: "right" as const,
      sorter: (a: any, b: any) =>
        a.performance.total_revenue - b.performance.total_revenue,
      render: (val: number) => (
        <Text strong className="text-emerald-600 text-base">
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
        placeHolderText="Search staff"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Staff Performance"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-staff">
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
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3  flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    Date Period
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
                    <UserOutlined className="text-blue-500" />
                    Specific Staff
                  </label>
                  <Select
                    className="w-full"
                    placeholder="All Staff Members"
                    loading={isStaffLoading}
                    value={filter.staff_id || undefined}
                    onChange={(val) => handleFilterChange("staff_id", val)}
                    allowClear
                    size="large"
                    showSearch
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
                    filterOption={(input, option: any) =>
                      option?.children
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  />
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
          ) : sortedData.length === 0 ? (
            <Empty
              description="No staff performance data available for this period"
              className="mt-20"
            />
          ) : (
            <div className="space-y-8">
              {/* --- 1. High Level Stats --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={8}>
                  <StatCard
                    title="Total Revenue Generated"
                    value={summaryStats.totalRevenue}
                    color="#10B981"
                    icon={<DollarOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <StatCard
                    title="Total Sales Completed"
                    value={summaryStats.totalSales}
                    color="#3B82F6"
                    icon={<ShopOutlined className="text-white text-xl" />}
                    isCurrency={false}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <StatCard
                    title="Active Staff"
                    value={
                      sortedData.filter((s) => s.performance.sales_count > 0)
                        .length
                    }
                    color="#F59E0B"
                    icon={<TeamOutlined className="text-white text-xl" />}
                    isCurrency={false}
                    suffix={`/ ${sortedData.length}`}
                  />
                </Col>
              </Row>

              {/* --- 2. The Podium (Top 3) --- */}
              {topThree.length > 0 && (
                <div>
                  <Title
                    level={4}
                    className="mb-4 text-gray-700 flex items-center gap-2"
                  >
                    <CrownOutlined className="text-yellow-500" /> Top 3 Performers
                  </Title>
                  <Row gutter={[24, 24]} align="bottom" className="mb-8">
                    {/* Silver (2nd) - Displayed 1st in DOM for mobile, but visualized via flex order if needed, but simplified here */}
                    <Col xs={24} md={8} className="order-2 md:order-1 md:mt-8">
                      {topThree[1] && (
                        <TopPerformerCard staff={topThree[1]} rank={2} />
                      )}
                    </Col>
                    {/* Gold (1st) */}
                    <Col xs={24} md={8} className="order-1 md:order-2">
                      {topThree[0] && (
                        <TopPerformerCard staff={topThree[0]} rank={1} />
                      )}
                    </Col>
                    {/* Bronze (3rd) */}
                    <Col xs={24} md={8} className="order-3 md:order-3 md:mt-8">
                      {topThree[2] && (
                        <TopPerformerCard staff={topThree[2]} rank={3} />
                      )}
                    </Col>
                  </Row>
                </div>
              )}

              {/* --- 3. Visualization & Table Layout --- */}
              <Row gutter={[24, 24]}>
                {/* Chart Section */}
                <Col xs={24} lg={24}>
                  <Card className="rounded-2xl border-0 bg-white/90 mb-6">
                    <div className="mb-6 flex justify-between items-center">
                      <div>
                        <Title level={4} className="mb-1">
                          Revenue by Staff
                        </Title>
                        <Text className="text-sm text-gray-500">
                          Top 10 staff members by revenue generation
                        </Text>
                      </div>
                    </div>
                    <div style={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            tickFormatter={(val) => `${val / 1000}k`}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "#F3F4F6" }}
                          />
                          <Bar
                            dataKey="revenue"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? "#F59E0B" : "#3B82F6"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Table Section */}
                <Col xs={24}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <TeamOutlined className="text-blue-600" />
                        <span>Full Performance Ranking</span>
                      </div>
                    }
                    className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
                  >
                    <Table
                      columns={columns}
                      dataSource={sortedData}
                      loading={isLoading || isFetching}
                      rowKey={(record) => record.staff.id}
                      pagination={{ pageSize: 10 }}
                      className="modern-table"
                      scroll={{ x: 800 }}
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

export default StaffPerformance;
