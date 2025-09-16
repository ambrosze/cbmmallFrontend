import { UserResponseTopLevel } from "@/types/loginInUserType";
import { Icon } from "@iconify/react";
import { Badge, Button, Card, InputNumber, Select, Space, Tag } from "antd";
import React, { useState } from "react";
import { useLocalStorage } from "react-use";

interface FilterState {
  store_id?: string;
  item_id?: string;
  "item.type_id"?: string;
  "item.colour_id"?: string;
  "item.category_id"?: string;
  "item.material"?: string;
  out_of_stock?: string;
  low_stock?: number;
}

interface ItemsFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  showBtn?: boolean;
  selectedFilterTypes?: any;
  setSelectedFilterTypes?: any;
  storeOptions?: Array<{ label: string; value: string }>;
  categoryOptions?: Array<{ label: string; value: string }>;
  typeOptions?: Array<{ label: string; value: string }>;
  colourOptions?: Array<{ label: string; value: string }>;
  itemOptions?: Array<{ label: string; value: string }>;
  hideSomeFilters?: boolean;
  filterKeys?: {
    essentialKeys?: string[];
    advancedKeys?: string[];
    typeKey?: string;
    colourKey?: string;
    categoryKey?: string;
    materialKey?: string;
    stockKey?: string;
    lowStockKey?: string;
    itemKey?: string;
    storeKey?: string;
  };
}

const ItemsFilter: React.FC<ItemsFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  showBtn = true,
  storeOptions = [],
  categoryOptions = [],
  typeOptions = [],
  colourOptions = [],
  itemOptions = [],
  hideSomeFilters = true,
  filterKeys = {
    essentialKeys: ["store_id", "item.category_id"],
    advancedKeys: [
      "item.type_id",
      "item.colour_id",
      "item.material",
      "out_of_stock",
      "low_stock",
      "item_id",
    ],
    typeKey: "item.type_id",
    colourKey: "item.colour_id",
    categoryKey: "item.category_id",
    materialKey: "item.material",
    stockKey: "out_of_stock",
    lowStockKey: "low_stock",
    itemKey: "item_id",
    storeKey: "store_id",
  },
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loginResponse, setLoginResponse] =
    useLocalStorage<UserResponseTopLevel | null>("authLoginResponse", null);
  const materialOptions = [
    {
      value: "Gold",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span>Gold</span>
        </div>
      ),
    },
    {
      value: "Silver",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span>Silver</span>
        </div>
      ),
    },
    {
      value: "Platinum",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <span>Platinum</span>
        </div>
      ),
    },
    {
      value: "Diamond",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-200"></div>
          <span>Diamond</span>
        </div>
      ),
    },
  ];

  const stockStatusOptions = [
    {
      value: "1",
      label: (
        <div className="flex items-center gap-2">
          <Icon icon="mdi:alert-circle" className="w-4 h-4 text-red-500" />
          <span>Show Out of Stock Only</span>
        </div>
      ),
    },
    {
      value: "0",
      label: (
        <div className="flex items-center gap-2">
          <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500" />
          <span>Show In Stock Only</span>
        </div>
      ),
    },
  ];

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters };
    if (value !== undefined && value !== null && value !== "") {
      newFilters[key] = value as any;
    } else {
      delete newFilters[key];
    }
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  const getMaterialColor = (material: string) => {
    switch (material?.toLowerCase()) {
      case "gold":
        return "gold";
      case "silver":
        return "default";
      case "platinum":
        return "purple";
      case "diamond":
        return "blue";
      default:
        return "default";
    }
  };

  const getEssentialFiltersCount = () => {
    return Object.keys(filters).filter((key) =>
      filterKeys.essentialKeys?.includes(key)
    ).length;
  };

  const getAdvancedFiltersCount = () => {
    return Object.keys(filters).filter((key) =>
      filterKeys.advancedKeys?.includes(key)
    ).length;
  };

  return (
    <div className="mb-6">
      <Card
        className="shadow-f2 border-0 bg-gradient-to-r from-white to-gray-50/50"
        style={{
          borderRadius: "16px",
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl shadow-sm">
                <Icon
                  icon="mdi:filter-variant"
                  className="w-5 h-5 text-emerald-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-lg">
                  Item Filters
                </span>
                {getActiveFiltersCount() > 0 && (
                  <Badge
                    count={getActiveFiltersCount()}
                    style={{
                      backgroundColor: "#10b981",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                    }}
                    size="small"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Advanced Filters Button */}
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                type="text"
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl px-4 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ borderRadius: "12px" }}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                    className="w-4 h-4"
                  />
                  <span>{isExpanded ? "Less Filters" : "More Filters"}</span>
                  {getAdvancedFiltersCount() > 0 && !isExpanded && (
                    <Badge
                      count={getAdvancedFiltersCount()}
                      size="small"
                      style={{
                        backgroundColor: "#f59e0b",
                        fontSize: "10px",
                        minWidth: "16px",
                        height: "16px",
                        lineHeight: "16px",
                      }}
                    />
                  )}
                </div>
              </Button>

              {/* Clear Filters Button */}
              {getActiveFiltersCount() > 0 && (
                <Button
                  onClick={onClearFilters}
                  icon={<Icon icon="mdi:filter-remove" className="w-4 h-4" />}
                  type="text"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl px-4 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ borderRadius: "12px" }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Essential Filters - Always Visible */}
          <div className="flex flex-wrap gap-4 items-center w-full">
            {/* Store Filter */}
            {loginResponse?.user.is_admin && (
              <div className="hidden flex-col gap-2 min-w-[160px]">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Icon icon="mdi:store" className="w-3 h-3" />
                  Store
                </label>
                <Select
                  placeholder={
                    <div className="flex items-center gap-2 text-gray-500">
                      <Icon icon="mdi:store-outline" className="w-4 h-4" />
                      <span>All Stores</span>
                    </div>
                  }
                  value={filters[filterKeys.storeKey as keyof FilterState]}
                  onChange={(value) =>
                    handleFilterChange(
                      filterKeys.storeKey as keyof FilterState,
                      value
                    )
                  }
                  allowClear
                  style={{ minWidth: 160 }}
                  className="custom-select"
                  options={storeOptions}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-col gap-2 min-w-[160px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:tag" className="w-3 h-3" />
                Category
              </label>
              <Select
                placeholder={
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon icon="mdi:tag-outline" className="w-4 h-4" />
                    <span>All Categories</span>
                  </div>
                }
                value={filters[filterKeys.categoryKey as keyof FilterState]}
                onChange={(value) =>
                  handleFilterChange(
                    filterKeys.categoryKey as keyof FilterState,
                    value
                  )
                }
                allowClear
                style={{ minWidth: 160 }}
                className="custom-select"
                options={categoryOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
          </div>

          {/* Advanced Filters - Collapsible */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-6 pt-2 border-t border-gray-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:tune" className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Advanced Filters
                </span>
              </div>

              {/* Filter Row 1 */}
              <div className="flex flex-wrap gap-4 items-center w-full">
                {/* Type Filter */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Icon icon="mdi:shape" className="w-3 h-3" />
                    Type
                  </label>
                  <Select
                    placeholder={
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon icon="mdi:shape-outline" className="w-4 h-4" />
                        <span>All Types</span>
                      </div>
                    }
                    value={filters[filterKeys.typeKey as keyof FilterState]}
                    onChange={(value) =>
                      handleFilterChange(
                        filterKeys.typeKey as keyof FilterState,
                        value
                      )
                    }
                    allowClear
                    style={{ minWidth: 140 }}
                    className="custom-select"
                    options={typeOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </div>

                {/* Colour Filter */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Icon icon="mdi:palette" className="w-3 h-3" />
                    Colour
                  </label>
                  <Select
                    placeholder={
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon icon="mdi:palette-outline" className="w-4 h-4" />
                        <span>All Colours</span>
                      </div>
                    }
                    value={filters[filterKeys.colourKey as keyof FilterState]}
                    onChange={(value) =>
                      handleFilterChange(
                        filterKeys.colourKey as keyof FilterState,
                        value
                      )
                    }
                    allowClear
                    style={{ minWidth: 140 }}
                    className="custom-select"
                    options={colourOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </div>

                {/* Material Filter */}
                <div className="flex flex-col gap-2 min-w-[160px]">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Icon icon="mdi:gold" className="w-3 h-3" />
                    Material
                  </label>
                  <Select
                    placeholder={
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon icon="mdi:gold" className="w-4 h-4" />
                        <span>All Materials</span>
                      </div>
                    }
                    value={filters[filterKeys.materialKey as keyof FilterState]}
                    onChange={(value) =>
                      handleFilterChange(
                        filterKeys.materialKey as keyof FilterState,
                        value
                      )
                    }
                    allowClear
                    style={{ minWidth: 160 }}
                    className="custom-select"
                    options={materialOptions}
                  />
                </div>
              </div>

              {/* Filter Row 2 */}
              <div className="flex flex-wrap gap-4 items-center w-full">
                {/* Stock Status Filter */}
                {hideSomeFilters && (
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Icon icon="mdi:package-variant" className="w-3 h-3" />
                      Stock Status
                    </label>
                    <Select
                      placeholder={
                        <div className="flex items-center gap-2 text-gray-500">
                          <Icon
                            icon="mdi:package-variant-closed"
                            className="w-4 h-4"
                          />
                          <span>All Stock</span>
                        </div>
                      }
                      value={filters[filterKeys.stockKey as keyof FilterState]}
                      onChange={(value) =>
                        handleFilterChange(
                          filterKeys.stockKey as keyof FilterState,
                          value
                        )
                      }
                      allowClear
                      style={{ minWidth: 180 }}
                      className="custom-select"
                      options={stockStatusOptions}
                    />
                  </div>
                )}

                {/* Low Stock Threshold */}
                {hideSomeFilters && (
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Icon icon="mdi:alert-octagon" className="w-3 h-3" />
                      Low Stock ≤
                    </label>
                    <InputNumber
                      placeholder="e.g. 5"
                      value={
                        filters[filterKeys.lowStockKey as keyof FilterState]
                      }
                      onChange={(value: any) =>
                        handleFilterChange(
                          filterKeys.lowStockKey as keyof FilterState,
                          value
                        )
                      }
                      min={0}
                      max={1000}
                      style={{ width: "100%", minWidth: 140 }}
                      className="custom-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="pt-6 border-t border-gray-200/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Icon
                    icon="mdi:tag-multiple"
                    className="w-4 h-4 text-emerald-600"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Active Filters:
                </span>
              </div>
              <Space wrap size={[8, 8]}>
                {filters[filterKeys.storeKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.storeKey as keyof FilterState,
                        undefined
                      )
                    }
                    color="blue"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:store" className="w-3 h-3" />
                    Store:{" "}
                    {storeOptions.find(
                      (s) =>
                        s.value ===
                        filters[filterKeys.storeKey as keyof FilterState]
                    )?.label ||
                      filters[filterKeys.storeKey as keyof FilterState]}
                  </Tag>
                )}
                {filters[filterKeys.categoryKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.categoryKey as keyof FilterState,
                        undefined
                      )
                    }
                    color="purple"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:tag" className="w-3 h-3" />
                    Category:{" "}
                    {categoryOptions.find(
                      (c) =>
                        c.value ===
                        filters[filterKeys.categoryKey as keyof FilterState]
                    )?.label ||
                      filters[filterKeys.categoryKey as keyof FilterState]}
                  </Tag>
                )}
                {filters[filterKeys.typeKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.typeKey as keyof FilterState,
                        undefined
                      )
                    }
                    color="cyan"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:shape" className="w-3 h-3" />
                    Type:{" "}
                    {typeOptions.find(
                      (t) =>
                        t.value ===
                        filters[filterKeys.typeKey as keyof FilterState]
                    )?.label ||
                      filters[filterKeys.typeKey as keyof FilterState]}
                  </Tag>
                )}
                {filters[filterKeys.colourKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.colourKey as keyof FilterState,
                        undefined
                      )
                    }
                    color="magenta"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:palette" className="w-3 h-3" />
                    Colour:{" "}
                    {colourOptions.find(
                      (c) =>
                        c.value ===
                        filters[filterKeys.colourKey as keyof FilterState]
                    )?.label ||
                      filters[filterKeys.colourKey as keyof FilterState]}
                  </Tag>
                )}
                {filters[filterKeys.materialKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.materialKey as keyof FilterState,
                        undefined
                      )
                    }
                    color={getMaterialColor(
                      filters[
                        filterKeys.materialKey as keyof FilterState
                      ] as string
                    )}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:gold" className="w-3 h-3" />
                    Material:{" "}
                    {filters[filterKeys.materialKey as keyof FilterState]}
                  </Tag>
                )}
                {filters[filterKeys.stockKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.stockKey as keyof FilterState,
                        undefined
                      )
                    }
                    color={
                      filters[filterKeys.stockKey as keyof FilterState] === "1"
                        ? "red"
                        : "green"
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon
                      icon={
                        filters[filterKeys.stockKey as keyof FilterState] ===
                        "1"
                          ? "mdi:alert-circle"
                          : "mdi:check-circle"
                      }
                      className="w-3 h-3"
                    />
                    {filters[filterKeys.stockKey as keyof FilterState] === "1"
                      ? "Out of Stock Only"
                      : "In Stock Only"}
                  </Tag>
                )}
                {filters[filterKeys.lowStockKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.lowStockKey as keyof FilterState,
                        undefined
                      )
                    }
                    color="orange"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:alert-octagon" className="w-3 h-3" />
                    Low Stock ≤{" "}
                    {filters[filterKeys.lowStockKey as keyof FilterState]}
                  </Tag>
                )}
                {filters[filterKeys.itemKey as keyof FilterState] && (
                  <Tag
                    closable
                    onClose={() =>
                      handleFilterChange(
                        filterKeys.itemKey as keyof FilterState,
                        undefined
                      )
                    }
                    color="geekblue"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:magnify" className="w-3 h-3" />
                    Item:{" "}
                    {itemOptions.find(
                      (i) =>
                        i.value ===
                        filters[filterKeys.itemKey as keyof FilterState]
                    )?.label ||
                      filters[filterKeys.itemKey as keyof FilterState]}
                  </Tag>
                )}
              </Space>
            </div>
          )}

          {/* Custom CSS */}
          <style jsx>{`
            :global(.custom-select .ant-select-selector),
            :global(.custom-input .ant-input-number) {
              border-radius: 12px !important;
              border: 1px solid #e5e7eb !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
              transition: all 0.2s ease !important;
            }
            :global(.custom-select .ant-select-selector:hover),
            :global(.custom-input .ant-input-number:hover) {
              border-color: #10b981 !important;
              box-shadow: 0 4px 12px 0 rgba(16, 185, 129, 0.15) !important;
            }
            :global(.custom-select.ant-select-focused .ant-select-selector),
            :global(.custom-input .ant-input-number-focused) {
              border-color: #10b981 !important;
              box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
            }
          `}</style>
        </div>
      </Card>
    </div>
  );
};

export default ItemsFilter;
