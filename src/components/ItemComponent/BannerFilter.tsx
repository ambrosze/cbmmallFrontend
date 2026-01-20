import { Icon } from "@iconify/react";
import { Badge, Button, Card, Input, Select, Tag } from "antd";
import React, { useMemo, useState } from "react";

export type BannerFilterState = {
  group?: string;
  key?: string;
};

interface OptionType {
  label: string;
  value: string;
}

interface BannerFilterProps {
  filters: BannerFilterState;
  onFilterChange: (filters: BannerFilterState) => void;
  onClearFilters: () => void;
  groupOptions?: OptionType[];
}

const BannerFilter: React.FC<BannerFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  groupOptions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== "",
    ).length;
  }, [filters]);

  const handleChange = (
    key: keyof BannerFilterState,
    value: string | undefined,
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
                Banner Filters
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
                <span>{isExpanded ? "Filter Options" : "Show Filters"}</span>
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

        {/* Filters Section */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Group Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Icon
                  icon="mdi:folder-outline"
                  className="w-4 h-4 text-indigo-500"
                />
                Filter by Group
              </label>
              <Select
                placeholder="Select Banner Group"
                value={filters.group}
                onChange={(val) => handleChange("group", val)}
                className="w-full"
                allowClear
                showSearch
                optionFilterProp="label"
                options={groupOptions}
                style={{ height: 42 }}
              />
            </div>

            {/* Key Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Icon
                  icon="mdi:key-variant"
                  className="w-4 h-4 text-indigo-500"
                />
                Filter by Key
              </label>
              <Input
                placeholder="Enter Banner Key"
                value={filters.key}
                onChange={(e) => handleChange("key", e.target.value)}
                className="w-full"
                allowClear
                style={{ height: 42 }}
              />
            </div>
          </div>
        )}

        {/* Active Filters Summary at the bottom when collapsed */}
        {!isExpanded && activeCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in duration-300">
            {filters.group && (
              <Tag
                closable
                onClose={() => handleChange("group", undefined)}
                className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span className="text-[11px] font-bold uppercase opacity-60">
                  Group:
                </span>
                <span className="font-semibold">
                  {groupOptions.find((o) => o.value === filters.group)?.label ||
                    filters.group}
                </span>
              </Tag>
            )}
            {filters.key && (
              <Tag
                closable
                onClose={() => handleChange("key", undefined)}
                className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span className="text-[11px] font-bold uppercase opacity-60">
                  Key:
                </span>
                <span className="font-semibold">{filters.key}</span>
              </Tag>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BannerFilter;
