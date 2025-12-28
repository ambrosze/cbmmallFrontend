import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllProductPerformanceReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  CalendarOutlined,
  ClearOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  FireOutlined,
  ReloadOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  UpOutlined,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

// --- Helper Functions ---

const parsePrice = (priceString: string | null): number => {
  if (!priceString) return 0;
  // Handles single price ("23000.00") or range ("2000.00-2500.00")
  const parts = priceString.split("-");
  return parseFloat(parts[0].trim());
};

// --- Components ---

const StatCard = ({ title, value, prefix, color, icon, isCurrency }: any) => (
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

const ProductRankCard = ({ product, rank }: any) => {
  if (!product) return null;

  return (
    <Card className="border-0  relative overflow-hidden h-full transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative mb-3">
          <Avatar
            size={80}
            shape="square"
            className={`border-4 border-white shadow-md bg-gray-200 text-2xl font-bold`}
            src={product.image?.url}
          >
            {product.name?.charAt(0)}
          </Avatar>
          <div
            className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-r ${
              rank === 1
                ? "from-yellow-400 to-orange-500"
                : rank === 2
                ? "from-gray-300 to-gray-400"
                : "from-orange-300 to-red-400"
            }`}
          >
            {rank}
          </div>
        </div>

        <Title level={5} className="m-0 mb-1 line-clamp-2 h-12">
          {product.name}
        </Title>
        <Text type="secondary" className="text-xs mb-4">
          Stock: {product.available_quantity}
        </Text>

        <div className="w-full grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl">
          <div className="text-center">
            <Text className="text-xs text-gray-500 block">Sold Units</Text>
            <Text strong className="text-blue-600">
              {product.total_sold}
            </Text>
          </div>
          <div className="text-center border-l border-gray-200">
            <Text className="text-xs text-gray-500 block">Est. Revenue</Text>
            <Text strong className="text-emerald-600">
              {formatCurrency(product.estimatedRevenue)}
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
        <p className="text-blue-500 font-semibold m-0 text-sm">
          Units Sold: {payload[0].value}
        </p>
        <p className="text-emerald-600 font-medium m-0 text-xs mt-1">
          Est. Revenue: {formatCurrency(payload[0].payload.revenue)}
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---

const ProductPerformanceReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    limit: 20,
    type: "",
  });

  const { data, isLoading, refetch } = useGetAllProductPerformanceReportQuery({
    filter,
  });

  // --- Derived Data Calculations ---
  const { summaryStats, sortedData, topThree, chartData } = useMemo(() => {
    const rawProducts = data?.data?.products || [];

    // 1. Calculate Estimated Revenue and transform data
    const transformed = rawProducts.map((p: any) => {
      const price = parsePrice(p.display_price);
      return {
        ...p,
        estimatedRevenue: p.total_sold * price,
        priceValue: price,
      };
    });

    // 2. Calculate Aggregates
    const stats = transformed.reduce(
      (acc: any, curr: any) => ({
        totalRevenue: acc.totalRevenue + curr.estimatedRevenue,
        totalUnitsSold: acc.totalUnitsSold + curr.total_sold,
      }),
      { totalRevenue: 0, totalUnitsSold: 0 }
    );

    // Sort by Total Sold for Leaderboard and Chart
    const sorted = [...transformed].sort((a, b) => b.total_sold - a.total_sold);

    // 3. Top Three
    const top = sorted.slice(0, 3);

    // 4. Chart Data (Top 10 to avoid clutter)
    const chart = sorted.slice(0, 10).map((item) => ({
      name: item.name,
      unitsSold: item.total_sold,
      revenue: item.estimatedRevenue,
    }));

    return {
      summaryStats: stats,
      sortedData: sorted,
      topThree: top,
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
    setFilter({ start_date: "", end_date: "", limit: 20, type: "" });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;

  // --- Table Columns ---
  const columns = [
    {
      title: "Rank",
      key: "rank",
      width: 60,
      render: (_: any, __: any, index: number) => {
        const rank = index + 1;
        return (
          <span
            className={`font-bold ${
              rank <= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            #{rank}
          </span>
        );
      },
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={40}
            src={record.image?.url}
            className="bg-gray-100 border border-gray-200"
          >
            {text?.charAt(0)}
          </Avatar>
          <div className="font-semibold text-gray-800">{text}</div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "display_price",
      key: "display_price",
      render: (price: string) => (
        <Tag className="rounded-full px-2">
          {price.includes("-") ? price : formatCurrency(parsePrice(price))}
        </Tag>
      ),
    },
    {
      title: "Stock",
      dataIndex: "available_quantity",
      key: "available_quantity",
      align: "center" as const,
      render: (quantity: number) => (
        <Tag color={quantity > 10 ? "green" : quantity > 0 ? "orange" : "red"}>
          {quantity === 0 ? "OUT OF STOCK" : quantity}
        </Tag>
      ),
    },
    {
      title: "Total Sold",
      dataIndex: "total_sold",
      key: "total_sold",
      align: "right" as const,
      sorter: (a: any, b: any) => a.total_sold - b.total_sold,
      defaultSortOrder: "descend" as const,
      render: (val: number) => (
        <span className="font-bold text-lg text-blue-600">{val}</span>
      ),
    },
    {
      title: "Est. Revenue",
      dataIndex: "estimatedRevenue",
      key: "estimatedRevenue",
      align: "right" as const,
      sorter: (a: any, b: any) => a.estimatedRevenue - b.estimatedRevenue,
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
        placeHolderText="Search products"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Product Performance Report"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-products">
          {/* --- Filters Button and Logic (Unchanged) --- */}
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
                    Sales Period
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
                    <TagOutlined className="text-blue-500" />
                    Report Type
                  </label>
                  <Select
                    className="w-full"
                    placeholder="All Products"
                    value={filter.type || undefined}
                    onChange={(val) => handleFilterChange("type", val)}
                    allowClear
                    size="large"
                  >
                    <Option value="top_selling">Top Selling (Units)</Option>
                    <Option value="trending">Trending (Revenue)</Option>
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
          ) : sortedData.length === 0 ? (
            <Empty
              description="No product performance data available for this period"
              className="mt-20"
            />
          ) : (
            <div className="space-y-8">
              {/* --- 1. High Level Stats (Unchanged) --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={8}>
                  <StatCard
                    title="Total Estimated Revenue"
                    value={summaryStats.totalRevenue}
                    color="#10B981"
                    icon={<DollarOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <StatCard
                    title="Total Units Sold"
                    value={summaryStats.totalUnitsSold}
                    color="#3B82F6"
                    icon={
                      <ShoppingCartOutlined className="text-white text-xl" />
                    }
                    isCurrency={false}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <StatCard
                    title="Products in Report"
                    value={sortedData.length}
                    color="#8B5CF6"
                    icon={<RiseOutlined className="text-white text-xl" />}
                    isCurrency={false}
                  />
                </Col>
              </Row>

              {/* --- 2. Top Selling Showcase (Unchanged) --- */}
              {topThree.length > 0 && (
                <div>
                  <Title
                    level={4}
                    className="mb-4 text-gray-700 flex items-center gap-2"
                  >
                    <FireOutlined className="text-red-500" /> Best Performing
                    Products
                  </Title>
                  <Row gutter={[24, 24]} className="mb-8">
                    {topThree.map((product, index) => (
                      <Col xs={24} md={8} key={product.id}>
                        <ProductRankCard product={product} rank={index + 1} />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* --- NEW STANDALONE PREMIUM BAR CHART --- */}
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Card className=" rounded-3xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
                    <div className="p-6 pb-2">
                      <Title level={4} className="m-0 text-gray-800">
                        Sales Distribution Analysis
                      </Title>
                      <Text className="text-gray-500 text-sm">
                        Top 10 items by purchase volume relative to highest
                        seller
                      </Text>
                    </div>
                    <div className="p-6 h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          layout="vertical"
                          margin={{ top: 10, right: 50, left: 140, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient
                              id="premiumGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            strokeOpacity={0.1}
                          />
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 13,
                              fill: "#4B5563",
                              fontWeight: 600,
                            }}
                            width={130}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "#F9FAFB" }}
                          />
                          <Bar
                            dataKey="unitsSold"
                            fill="url(#premiumGradient)"
                            radius={[0, 10, 10, 0]}
                            barSize={24}
                            background={{ fill: "#f1f5f9", radius: 10 }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* --- 4. Table Section (Now full width) --- */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <RiseOutlined className="text-blue-600" />
                        <span>Full Product Ranking</span>
                      </div>
                    }
                    className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm h-full"
                    bodyStyle={{ padding: 0 }}
                  >
                    <Table
                      columns={columns}
                      dataSource={sortedData}
                      rowKey="id"
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

export default ProductPerformanceReport;
