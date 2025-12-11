import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllProductsQuery } from "@/services/products/product-list";
import { useGetAllProfitAnalysisReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  CalendarOutlined,
  ClearOutlined,
  DollarCircleOutlined,
  DownOutlined,
  FilterOutlined,
  GlobalOutlined,
  LineChartOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  SkinOutlined,
  StockOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Tooltip as AntTooltip,
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
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

// --- Helper Functions and Constants ---

const StatCard = ({ title, value, color, icon, isCurrency, suffix }: any) => {
  const isNegative = value < 0;
  const statColor = isNegative ? "#EF4444" : color;

  return (
    <Card
      className="relative overflow-hidden shadow hover:shadow-lg transition-all duration-300 border-0 h-full group"
      style={{
        background: `linear-gradient(135deg, ${statColor}08 0%, ${statColor}09 100%)`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-5 transition-opacity group-hover:opacity-10"
        style={{
          background: `radial-gradient(circle, ${statColor} 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: statColor }}
          >
            {icon}
          </div>
        </div>
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
          {title}
        </Text>
        <Statistic
          value={value}
          suffix={suffix}
          precision={isCurrency ? 2 : 0}
          formatter={(val) => (isCurrency ? formatCurrency(Number(val)) : val)}
          valueStyle={{
            fontWeight: 700,
            fontSize: "1.75rem",
            color: isNegative ? statColor : "#1F2937",
          }}
        />
      </div>
    </Card>
  );
};

const CustomProfitTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border-0 shadow-xl rounded-xl">
        <p className="font-bold text-gray-800 mb-2 line-clamp-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={`tooltip-${index}`}
            className="m-0 text-sm"
            style={{ color: entry.color }}
          >
            {entry.name}:{" "}
            <span className="font-semibold">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Component ---

const ProfitAnalysisReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [productSearch, setProductSearch] = useState<string>("");
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    product_id: "",
  });

  const {
    data: reportData,
    isLoading: isReportLoading,
    refetch,
    isFetching,
  } = useGetAllProfitAnalysisReportQuery({ filter });

  const { data: allProducts, isLoading: isLoadingProducts } =
    useGetAllProductsQuery({
      paginate: true,
      per_page: 20,
      page: 1,
      q: productSearch,
      include: "images",
    });

  const productOptions =
    allProducts?.data?.map((p: any) => ({
      label: p.name,
      value: p.id,
    })) || [];

  const { summary, productProfits, chartData } = useMemo(() => {
    const summary = reportData?.data?.summary || {
      total_revenue: 0,
      total_cost: 0,
      total_profit: 0,
      overall_margin: 0,
    };
    const rawProductProfits = reportData?.data?.product_profits || [];

    // Ensure all numeric values are numbers
    const transformedProfits = rawProductProfits.map((item: any) => ({
      ...item,
      revenue: Number(item.revenue),
      cost: Number(item.cost),
      profit: Number(item.profit),
      margin: Number(item.margin),
      quantity_sold: Number(item.quantity_sold),
    }));

    // Data for the Bar Chart (Top 10 products by PROFIT)
    const sortedByProfit = [...transformedProfits].sort(
      (a, b) => b.profit - a.profit
    );
    const chart = sortedByProfit.slice(0, 10).map((item) => ({
      name: item.product.name,
      revenue: item.revenue,
      cost: item.cost,
      profit: item.profit,
    }));

    return {
      summary: {
        ...summary,
        total_revenue: Number(summary.total_revenue),
        total_cost: Number(summary.total_cost),
        total_profit: Number(summary.total_profit),
        overall_margin: Number(summary.overall_margin),
      },
      productProfits: transformedProfits,
      chartData: chart,
    };
  }, [reportData]);

  // --- Filter Handlers ---

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setFilter((prev) => ({
      ...prev,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
    }));
  };

  const handleProductSelect = (value: string) => {
    setFilter((prev) => ({ ...prev, product_id: value }));
  };

  const clearFilters = () => {
    setFilter({ start_date: "", end_date: "", product_id: "" });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;
  const isLoading = isReportLoading || isFetching;

  // --- Table Columns ---
  const columns = [
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "product_name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={40}
            src={record.product.image?.url}
            className="bg-gray-100 border border-gray-200"
          >
            {text?.charAt(0)}
          </Avatar>
          <div className="font-semibold text-gray-800 line-clamp-2">{text}</div>
        </div>
      ),
    },
    {
      title: "Units Sold",
      dataIndex: "quantity_sold",
      key: "quantity_sold",
      align: "right" as const,
      sorter: (a: any, b: any) => a.quantity_sold - b.quantity_sold,
      render: (val: number) => (
        <Tag color="blue" className="text-base font-semibold">
          {val}
        </Tag>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "right" as const,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (val: number) => (
        <Text strong className="text-emerald-600">
          {formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      align: "right" as const,
      sorter: (a: any, b: any) => a.cost - b.cost,
      render: (val: number) => (
        <Text strong className="text-red-500">
          {formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      align: "right" as const,
      sorter: (a: any, b: any) => a.profit - b.profit,
      defaultSortOrder: "descend" as const,
      render: (val: number) => (
        <Text strong className={val >= 0 ? "text-green-600" : "text-red-600"}>
          {formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: "Margin",
      dataIndex: "margin",
      key: "margin",
      align: "right" as const,
      sorter: (a: any, b: any) => a.margin - b.margin,
      render: (val: number) => (
        <Tag color={val >= 0 ? "green" : "red"}>{val.toFixed(2)}%</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header
        search={""}
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Analyze financial metrics"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Profit Analysis Report"
        btnText={""}
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
                    <ShoppingCartOutlined className="text-blue-500" />
                    Filter by Product
                  </label>
                  <Select
                    className="w-full"
                    placeholder="Search and select product"
                    value={filter.product_id || undefined}
                    onChange={handleProductSelect}
                    onSearch={setProductSearch}
                    showSearch
                    options={
                      allProducts?.data?.map((p: any) => ({
                        label: (
                          <AntTooltip title={`${p.name} `} placement="topRight">
                            <div className="flex items-center gap-2">
                              {p.images?.[0]?.url ? (
                                <img
                                  src={p.images[0].url}
                                  alt={p.name || "Product"}
                                  className="w-8 h-8 object-cover rounded"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                  <SkinOutlined className="text-gray-400" />
                                </div>
                              )}
                              <span>{p.name}</span>
                            </div>
                          </AntTooltip>
                        ) as any,
                        value: p.id,
                      })) || []
                    }
                    filterOption={false}
                    loading={isLoadingProducts}
                    allowClear
                    size="large"
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
          ) : summary.total_revenue === 0 ? (
            <Empty
              description="No profit data available for the selected filters"
              className="mt-20"
            />
          ) : (
            <div className="space-y-8">
              {/* --- 1. Key Performance Indicators (KPIs) --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} lg={6}>
                  <StatCard
                    title="Total Revenue"
                    value={summary.total_revenue}
                    color="#10B981"
                    icon={
                      <DollarCircleOutlined className="text-white text-xl" />
                    }
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatCard
                    title="Total Cost"
                    value={summary.total_cost}
                    color="#F59E0B"
                    icon={<StockOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatCard
                    title="Total Profit"
                    value={summary.total_profit}
                    color={summary.total_profit >= 0 ? "#3B82F6" : "#EF4444"}
                    icon={<GlobalOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <StatCard
                    title="Overall Margin"
                    value={summary.overall_margin}
                    color={summary.overall_margin >= 0 ? "#8B5CF6" : "#EF4444"}
                    icon={<GlobalOutlined className="text-white text-xl" />}
                    isCurrency={false}
                    suffix="%"
                  />
                </Col>
              </Row>

              {/* --- 2. Profitability Breakdown Chart (Combined Bar Chart) --- */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <LineChartOutlined className="text-blue-600" /> Top 10
                        Product Profitability Breakdown
                      </div>
                    }
                    className=" rounded-2xl border-0 bg-white/90 h-full"
                  >
                    <div style={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart // Using ComposedChart to combine bars, but only displaying bars
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                            horizontal={false}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            axisLine={false}
                            tickLine={false}
                            // Added margin to prevent long product names from being cut
                            width={150}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            interval={0}
                          />
                          <XAxis
                            type="number"
                            tickFormatter={(value) =>
                              `${formatCurrency(value)}`
                            }
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomProfitTooltip />} />
                          <Legend
                            wrapperStyle={{ paddingTop: "10px" }}
                            iconType="square"
                          />

                          <Bar
                            dataKey="revenue"
                            fill="#10B981A0" // Emerald (Revenue)
                            name="Revenue"
                            barSize={10}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="cost"
                            fill="#F59E0B70" // Amber (Cost)
                            name="Cost"
                            barSize={10}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="profit"
                            fill="#3B82F6A0" // Blue (Profit)
                            name="Profit"
                            barSize={10}
                            radius={[4, 4, 0, 0]}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* --- 3. Detailed Data Table (Product Profit Breakdown) --- */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <StockOutlined className="text-blue-600" />
                    <span>Product Profitability Table</span>
                  </div>
                }
                className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
                bodyStyle={{ padding: 0 }}
              >
                <Table
                  columns={columns as any}
                  dataSource={productProfits}
                  loading={isLoading}
                  rowKey={(record) => record.product.id}
                  pagination={{ pageSize: 10 }}
                  className="modern-table"
                  scroll={{ x: 1000 }}
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
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default ProfitAnalysisReport;
