import { Icon } from "@iconify/react";
import { Badge, Button, Card, InputNumber, Select, Switch, Tag } from "antd";
import React, { useMemo, useState } from "react";

export type InventoryFilterState = {
  store_id?: string;
  product_variant_id?: string;
  "productVariant.product_id"?: string;
  out_of_stock?: string; // "1" | "0"
  low_stock?: number;
};

interface OptionType {
  label: string;
  value: string;
}

interface InventoryFilterProps {
  filters: InventoryFilterState;
  onFilterChange: (filters: InventoryFilterState) => void;
  onClearFilters: () => void;
  storeOptions?: OptionType[];
  productOptions?: OptionType[];
  variantOptions?: OptionType[];
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  storeOptions = [],
  productOptions = [],
  variantOptions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount = useMemo(() => Object.keys(filters).length, [filters]);

  const handleChange = (
    key: keyof InventoryFilterState,
    value: string | number | undefined
  ) => {
    const next = { ...filters };
    if (value === undefined || value === "" || value === null) {
      delete (next as any)[key];
    } else {
      (next as any)[key] = value as any;
    }
    onFilterChange(next);
  };

  return (
    <div className="mb-6">
      <Card
        className="shadow-f2 bg-gradient-to-r border border-gray-100 from-white to-gray-50/50"
        style={{ borderRadius: 16 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl shadow-sm">
              <Icon
                icon="mdi:filter-variant"
                className="w-5 h-5 text-indigo-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 text-lg">
                Inventory Filters
              </span>
              {activeCount > 0 && (
                <Badge
                  count={activeCount}
                  style={{ backgroundColor: "#6366f1" }}
                  size="small"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              type="text"
              className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl px-4 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ borderRadius: 12 }}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                  className="w-4 h-4"
                />
                <span>{isExpanded ? "Less Filters" : "More Filters"}</span>
              </div>
            </Button>

            {activeCount > 0 && (
              <Button
                onClick={onClearFilters}
                icon={<Icon icon="mdi:filter-remove" className="w-4 h-4" />}
                type="text"
                className="text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl px-4 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ borderRadius: 12 }}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Filters area */}
        <div className={`mt-4 ${isExpanded ? "block" : "hidden"}`}>
          <div className="flex flex-wrap gap-4 items-end w-full">
            {/* Store */}
            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:store" className="w-3 h-3" /> Store
              </label>
              <Select
                placeholder={
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon icon="mdi:store-outline" className="w-4 h-4" />
                    <span>All Stores</span>
                  </div>
                }
                value={filters.store_id}
                onChange={(value) => handleChange("store_id", value)}
                allowClear
                style={{ minWidth: 200 }}
                options={storeOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            {/* Product */}
            <div className="flex flex-col gap-2 min-w-[220px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:shopping" className="w-3 h-3" /> Product
              </label>
              <Select
                placeholder={
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon icon="mdi:shopping-outline" className="w-4 h-4" />
                    <span>All Products</span>
                  </div>
                }
                value={filters["productVariant.product_id"]}
                onChange={(value) =>
                  handleChange("productVariant.product_id", value)
                }
                allowClear
                style={{ minWidth: 220 }}
                options={productOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            {/* Product Variant */}
            <div className="flex flex-col gap-2 min-w-[240px] hidden">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:shape" className="w-3 h-3" /> Product Variant
              </label>
              <Select
                placeholder={
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon icon="mdi:shape-outline" className="w-4 h-4" />
                    <span>All Variants</span>
                  </div>
                }
                value={filters.product_variant_id}
                onChange={(value) => handleChange("product_variant_id", value)}
                allowClear
                style={{ minWidth: 240 }}
                options={variantOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>

            {/* Out of stock */}
            <div className="flex flex-col gap-2 min-w-[160px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:alert-circle" className="w-3 h-3" /> Out of
                Stock
              </label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={filters.out_of_stock === "1"}
                  onChange={(checked) =>
                    handleChange("out_of_stock", checked ? "1" : "0")
                  }
                />
                <Tag color={filters.out_of_stock === "1" ? "red" : "green"}>
                  {filters.out_of_stock === "1" ? "Show OOS" : "Hide OOS"}
                </Tag>
              </div>
            </div>

            {/* Low stock */}
            <div className="flex flex-col gap-2 min-w-[160px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:numeric" className="w-3 h-3" /> Low Stock ≤
              </label>
              <InputNumber
                min={0}
                value={filters.low_stock}
                onChange={(value) =>
                  handleChange("low_stock", value ?? undefined)
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

       
      </Card>
    </div>
  );
};

export default InventoryFilter;
