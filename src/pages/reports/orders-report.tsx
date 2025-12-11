import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import PermissionGuard from "@/components/RolesPermission/PermissionGuard";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetAllEnumsQuery } from "@/services/global";
import { useGetAllOrdersReportQuery } from "@/services/reports";
import { formatCurrency } from "@/utils/fx";
import {
  CalendarOutlined,
  ClearOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
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
import Image from "next/image";
import { useState } from "react";
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

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const { Option } = Select;

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

// Status color mapping
const STATUS_COLORS: any = {
  new: { bg: "#DBEAFE", color: "#1E40AF", label: "New" },
  pending: { bg: "#FEF3C7", color: "#B45309", label: "Pending" },
  processing: { bg: "#E0E7FF", color: "#4338CA", label: "Processing" },
  completed: { bg: "#D1FAE5", color: "#065F46", label: "Completed" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "Cancelled" },
};

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
            : `${payload[0].value} Orders`}
        </p>
      </div>
    );
  }
  return null;
};

const OrdersReport = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    start_date: "",
    end_date: "",
    status: "",
    delivery_method: "",
    user_id: "",
  });

  const { data, isLoading, refetch, isFetching } = useGetAllOrdersReportQuery({
    filter,
  });

  const { data: orderStatusData, isLoading: isOrderStatusLoading } =
    useGetAllEnumsQuery({ enum: "OrderStatus" });

  const { data: deliveryMethodData, isLoading: isDeliveryMethodLoading } =
    useGetAllEnumsQuery({ enum: "DeliveryMethod" });

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
      status: "",
      delivery_method: "",
      user_id: "",
    });
  };

  const activeFiltersCount = Object.values(filter).filter(Boolean).length;

  const columns = [
    {
      title: "Order Reference",
      dataIndex: "reference",
      key: "reference",
      width: 180,
      fixed: "left",
      render: (text: string) => (
        <Text strong className="text-blue-600">
          {text}
        </Text>
      ),
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer",
      width: 250,
      render: (name: string, record: any) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
              {name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="font-medium">{name}</span>
          </div>
          <Text className="text-xs text-gray-500">
            {record.customer?.email}
          </Text>
        </div>
      ),
    },
    {
      title: "Store",
      dataIndex: ["store", "name"],
      key: "store",
      width: 150,
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <ShoppingOutlined className="text-gray-400" />
          <Text className="text-sm">{name}</Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const config = STATUS_COLORS[status] || {
          bg: "#F3F4F6",
          color: "#6B7280",
          label: status,
        };
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Items",
      dataIndex: "items_count",
      key: "items_count",
      width: 120,
      align: "center" as const,
      render: (count: number) => (
        <span className="px-3 whitespace-nowrap block py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
          {count} {count === 1 ? "item" : "items"}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_price",
      key: "total_price",
      width: 180,
      align: "right" as const,
      render: (val: number) => (
        <Text strong className="text-lg" style={{ color: "#10B981" }}>
          {formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (val: string) => (
        <span className="text-gray-600 text-sm">
          {dayjs(val).format("DD MMM YYYY")}
        </span>
      ),
    },
  ];

  const expandedRowRender = (record: any) => {
    const itemColumns = [
      {
        title: "Product",
        dataIndex: "name",
        key: "name",
        render: (name: string, item: any) => (
          <div className="flex items-center gap-3">
            {item.options?.image_url && (
              <div className="w-12 h-12">
                <Image
                  width={48}
                  height={48}
                  style={{ objectFit: "cover" }}
                  src={item.options.image_url}
                  alt={name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
            <Text className="font-medium">{name}</Text>
          </div>
        ),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price: string) => (
          <Text className="text-gray-600">{formatCurrency(Number(price))}</Text>
        ),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "center" as const,
        render: (qty: number) => (
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold">
            {qty}
          </span>
        ),
      },
      {
        title: "Subtotal",
        key: "subtotal",
        align: "right" as const,
        render: (_: any, item: any) => (
          <Text strong className="text-green-600">
            {formatCurrency(Number(item.price) * item.quantity)}
          </Text>
        ),
      },
    ];

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <Title level={5} className="mb-4">
          Order Items
        </Title>
        <Table
          columns={itemColumns}
          dataSource={record.items}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header
        search=""
        setSearch={() => {}}
        showSearch={false}
        placeHolderText="Search orders"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="Orders Analytics"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />

      <SharedLayout className="px-6 py-8">
        <PermissionGuard permission="reports.view-orders">
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
                <Col xs={24} sm={12} lg={7}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block flex items-center gap-2">
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
                <Col xs={24} sm={12} lg={5}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Order Status
                  </label>
                  <Select
                    className="w-full rounded-lg"
                    placeholder="All statuses"
                    loading={isOrderStatusLoading}
                    value={filter.status || undefined}
                    onChange={(val) => handleFilterChange("status", val)}
                    allowClear
                    showSearch
                    size="large"
                  >
                    {orderStatusData?.values?.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">
                    Delivery Method
                  </label>
                  <Select
                    className="w-full rounded-lg"
                    placeholder="All methods"
                    loading={isDeliveryMethodLoading}
                    value={filter.delivery_method || undefined}
                    onChange={(val) =>
                      handleFilterChange("delivery_method", val)
                    }
                    showSearch
                    allowClear
                    size="large"
                  >
                    {deliveryMethodData?.values?.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} lg={7}>
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
                <Col xs={24} sm={12} xl={8}>
                  <StatCard
                    title="Total Orders"
                    value={data?.data?.summary?.total_orders}
                    color="#3B82F6"
                    icon={
                      <ShoppingCartOutlined className="text-white text-xl" />
                    }
                    isCurrency={false}
                    trend={15}
                  />
                </Col>
                <Col xs={24} sm={12} xl={8}>
                  <StatCard
                    title="Total Revenue"
                    value={data?.data?.summary?.total_revenue}
                    color="#10B981"
                    icon={<DollarOutlined className="text-white text-xl" />}
                    isCurrency={true}
                    trend={12}
                  />
                </Col>
                <Col xs={24} sm={12} xl={8}>
                  <StatCard
                    title="Avg. Order Value"
                    value={data?.data?.summary?.average_order_value}
                    color="#F59E0B"
                    icon={<RiseOutlined className="text-white text-xl" />}
                    isCurrency={true}
                    trend={8}
                  />
                </Col>
              </Row>

              {/* --- Enhanced Visualizations --- */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card className=" rounded-2xl border-0 h-full bg-white/90">
                    <div className="mb-6">
                      <Title level={4} className="mb-1">
                        Orders by Status
                      </Title>
                      <Text className="text-sm text-gray-500">
                        Distribution of orders across different statuses
                      </Text>
                    </div>
                    <div style={{ height: 380 }}>
                      {data?.data?.status_breakdown?.length! > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data?.data?.status_breakdown?.map(
                              (item: any) => ({
                                ...item,
                                status:
                                  STATUS_COLORS[item.status]?.label ||
                                  item.status,
                                revenue: Number(item.revenue),
                              })
                            )}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#E5E7EB"
                            />
                            <XAxis
                              dataKey="status"
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
                            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                              {data?.data?.status_breakdown?.map(
                                (entry: any, index: number) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No status data available"
                        />
                      )}
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  <Card className="rounded-2xl border-0 h-full bg-white/90">
                    <div className="mb-4">
                      <Title level={4} className="mb-1">
                        Status Distribution
                      </Title>
                      <Text className="text-sm text-gray-500">
                        Order count by status
                      </Text>
                    </div>
                    <div style={{ height: 380 }}>
                      {data?.data?.status_breakdown?.length! > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data?.data?.status_breakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="count"
                              nameKey="status"
                              label={(entry) => `${entry.count}`}
                            >
                              {data?.data?.status_breakdown.map(
                                (entry: any, index: number) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip content={<CustomChartTooltip />} />

                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              wrapperStyle={{
                                fontSize: "13px",
                                fontWeight: 500,
                                position: "relative",
                                bottom: 80,
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

              {/* --- Enhanced Orders Table --- */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <Title level={4} style={{ margin: 0 }}>
                      Recent Orders
                    </Title>
                    <Text className="text-sm text-gray-500">
                      Last {data?.data?.recent_orders?.length || 0} orders
                    </Text>
                  </div>
                }
                className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm"
              >
                <Table
                  columns={columns as any}
                  dataSource={data?.data?.recent_orders}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} orders`,
                  }}
                  loading={isLoading || isFetching}
                  rowClassName={(record: any) =>
                    record.items?.length > 0 ? "cursor-pointer" : ""
                  }
                  scroll={{ x: 1000 }}
                  className="modern-table"
                  expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.items?.length > 0,
                    expandRowByClick: true, // <-- enables expanding by clicking anywhere on the row
                  }}
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
        .modern-table .ant-table-expanded-row > td {
          background: #F9FAFB !important;
        }
      `}</style>
    </div>
  );
};

export default OrdersReport;
