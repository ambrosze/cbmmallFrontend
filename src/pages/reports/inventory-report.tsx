import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllProductsQuery } from "@/services/products/product-list";
import { useGetAllInventoryReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  AlertOutlined,
  AppstoreOutlined,
  ClearOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  SkinOutlined,
  StopOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Tooltip as AntTooltip,
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
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

const { Text, Title } = Typography;
const { Option } = Select;

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

// --- Reusable Stat Card (Same as Order Report) ---
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
        {/* Optional: Add logic for trend if available in API later */}
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
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",

          fontSize: "1.5rem",
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
        <p className="font-bold text-gray-800 mb-2 text-sm">
          {label || payload[0].name}
        </p>
        <p className="text-blue-600 font-semibold m-0">
          {isCurrency
            ? formatCurrency(payload[0].value)
            : `${payload[0].value} Items`}
        </p>
      </div>
    );
  }
  return null;
};

const InventoryReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Filter State
  const [filter, setFilter] = useState({
    low_stock: "",
    out_of_stock: null as number | null, // 1 | 0
    product_id: "",
  });

  // Queries
  const { data, isLoading, refetch, isFetching } =
    useGetAllInventoryReportQuery({
      filter,
    });

  const { data: allProducts, isLoading: isLoadingProducts } =
    useGetAllProductsQuery({
      paginate: true,
      per_page: 50,
      page: 1,
      q: productSearch,
      include: "images", // Minimized include for search performance
    });

  // Derived Chart Data (Since API returns summary numbers)
  const pieChartData = useMemo(() => {
    if (!data?.data?.summary) return [];
    const s = data.data.summary;
    // Calculate "Healthy Stock" as Total - (Low + Out)
    const healthy = s.total_items - (s.low_stock_items + s.out_of_stock_items);

    return [
      {
        name: "Healthy Stock",
        value: healthy > 0 ? healthy : 0,
        color: "#10B981",
      },
      { name: "Low Stock", value: s.low_stock_items, color: "#F59E0B" },
      { name: "Out of Stock", value: s.out_of_stock_items, color: "#EF4444" },
    ];
  }, [data]);

  const activeFiltersCount = Object.values(filter).filter(
    (val) => val !== "" && val !== null
  ).length;

  const handleFilterChange = (key: string, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilter({
      low_stock: "",
      out_of_stock: null,
      product_id: "",
    });
    setProductSearch("");
  };

  const columns = [
    {
      title: "Product Details",
      dataIndex: "product",
      key: "product",
      render: (product: any, record: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {record.variant?.image?.url || product?.image?.url ? (
              <Image
                height={48}
                width={48}
                src={record.variant?.image?.url || product?.image?.url}
                alt={product?.name}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <SkinOutlined className="text-gray-400" />
              </div>
            )}
            {/* Sku Badge */}
            <div className="absolute -bottom-2 -right-2 bg-white px-1.5 py-0.5 rounded border shadow-sm text-[10px] font-mono text-gray-500">
              {record.variant?.sku?.slice(-4)}
            </div>
          </div>
          <div className="flex flex-col">
            <Text strong className="text-gray-800">
              {product?.name}
            </Text>
            <Text className="text-xs text-gray-500">
              SKU: {record.variant?.sku || "N/A"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Store",
      dataIndex: ["store", "name"],
      key: "store",
      render: (name: string) => (
        <Tag
          icon={<AppstoreOutlined />}
          color="blue"
          className="rounded-full px-3"
        >
          {name}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => {
        // Custom logic based on quantity if status string isn't detailed enough
        const isOutOfStock = record.quantity === 0;
        const isLowStock = record.quantity < 10 && record.quantity > 0; // Example threshold

        let color = "success";
        let label = "Available";
        let icon = null;

        if (isOutOfStock) {
          color = "error";
          label = "Out of Stock";
          icon = <StopOutlined />;
        } else if (isLowStock) {
          color = "warning";
          label = "Low Stock";
          icon = <AlertOutlined />;
        }

        return (
          <Tag
            color={color}
            icon={icon}
            className="rounded-full px-2 py-0.5 font-medium"
          >
            {label.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Stock Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      sorter: (a: any, b: any) => a.quantity - b.quantity,
      render: (qty: number) => (
        <div className="flex flex-col items-center">
          <span
            className={`text-lg font-bold ${
              qty === 0 ? "text-red-500" : "text-gray-700"
            }`}
          >
            {qty}
          </span>
          <span className="text-[10px] text-gray-400">units</span>
        </div>
      ),
    },
    {
      title: "Stock Value",
      dataIndex: "stock_value",
      key: "stock_value",
      align: "right" as const,
      sorter: (a: any, b: any) => a.stock_value - b.stock_value,
      render: (val: number) => (
        <Text strong className="text-emerald-600 font-mono text-base">
          {formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (val: string) => (
        <span className="text-gray-500 text-xs">
          {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header
        search=""
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Search inventory"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Inventory Analytics"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-inventory">
          {/* --- Filter Toggle Section --- */}
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
                <Col xs={24} sm={12} lg={6}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Product Search
                  </label>

                  <Select
                    showSearch
                    className="w-full"
                    size="large"
                    placeholder="Search by product name"
                    loading={isLoadingProducts}
                    filterOption={false}
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
                    onSearch={setProductSearch}
                    value={filter.product_id || undefined}
                    onChange={(val) => handleFilterChange("product_id", val)}
                    allowClear
                  />
                </Col>

                <Col xs={24} sm={12} lg={5}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Low Stock Threshold
                  </label>
                  <InputNumber
                    className="w-full rounded-lg"
                    placeholder="e.g. 5"
                    min={"0"}
                    size="large"
                    value={filter.low_stock}
                    onChange={(val) => handleFilterChange("low_stock", val)}
                  />
                </Col>

                <Col xs={24} sm={12} lg={5}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Availability
                  </label>
                  <Select
                    className="w-full"
                    size="large"
                    placeholder="Filter by status"
                    value={filter.out_of_stock}
                    onChange={(val) => handleFilterChange("out_of_stock", val)}
                    allowClear
                  >
                    <Option value={0}>In Stock</Option>
                    <Option value={1}>Out of Stock</Option>
                  </Select>
                </Col>

                <Col xs={24} sm={12} lg={8}>
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
                      Apply Filters
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
              {/* --- Summary Stats --- */}
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Total Items"
                    value={data?.data?.summary?.total_items}
                    color="#3B82F6"
                    icon={<AppstoreOutlined className="text-white text-xl" />}
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Low Stock Items"
                    value={data?.data?.summary?.low_stock_items}
                    color="#F59E0B"
                    icon={<AlertOutlined className="text-white text-xl" />}
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Out of Stock"
                    value={data?.data?.summary?.out_of_stock_items}
                    color="#EF4444"
                    icon={<StopOutlined className="text-white text-xl" />}
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatCard
                    title="Total Stock Value"
                    value={data?.data?.summary?.total_stock_value}
                    color="#10B981"
                    icon={<DollarOutlined className="text-white text-xl" />}
                    isCurrency={true}
                  />
                </Col>
              </Row>

              {/* --- Visualizations --- */}
              <Row gutter={[24, 24]}>
                {/* Chart 1: Stock Status Distribution */}
                <Col xs={24} lg={12}>
                  <Card className="rounded-2xl border-0 h-full bg-white/90">
                    <div className="mb-4">
                      <Title level={4} className="mb-1">
                        Inventory Health
                      </Title>
                      <Text className="text-sm text-gray-500">
                        Distribution of stock levels across all products
                      </Text>
                    </div>
                    <div style={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
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
                            {pieChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={entry.color}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomChartTooltip />} />
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

                {/* Chart 2: Inventory Value Breakdown (Mocking visually using same data for layout consistency) */}
                <Col xs={24} lg={12}>
                  <Card className="rounded-2xl border-0 h-full bg-white/90">
                    <div className="mb-4">
                      <Title level={4} className="mb-1">
                        Stock Composition
                      </Title>
                      <Text className="text-sm text-gray-500">
                        Item counts by category (Healthy vs Issues)
                      </Text>
                    </div>
                    <div style={{ height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={pieChartData}
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
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: "transparent" }}
                            content={<CustomChartTooltip />}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {pieChartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* --- Data Table --- */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <Title level={4} style={{ margin: 0 }}>
                      Inventory Items
                    </Title>
                    <Text className="text-sm text-gray-500">
                      Total {data?.data?.inventory_items?.length || 0} items
                      listed
                    </Text>
                  </div>
                }
                className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
              >
                {data?.data?.inventory_items?.length! > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={data?.data?.inventory_items}
                    rowKey="id"
                    loading={isLoading || isFetching}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: false,
                      showTotal: (total) => `Total ${total} items`,
                    }}
                    scroll={{ x: 1000 }}
                    className="modern-table"
                  />
                ) : (
                  <Empty
                    description="No inventory records found"
                    className="my-10"
                  />
                )}
              </Card>
            </div>
          )}
        </PermissionGuard>
      </SharedLayout>

      {/* --- CSS for Table Styling (Same as Order Report) --- */}
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

export default InventoryReport;
