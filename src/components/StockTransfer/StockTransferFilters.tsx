import { Icon } from "@iconify/react";
import { Badge, Button, Card, Select, Space, Tag } from "antd";
import React, { useState } from "react";

interface FilterState {
  status?: string;
  out_going?: string;
  in_coming?: string;
}

interface StockTransferFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const StockTransferFilters: React.FC<StockTransferFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    {
      value: "new",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
          <span className="font-medium">New</span>
        </div>
      ),
      color: "blue",
    },
    {
      value: "dispatched",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm"></div>
          <span className="font-medium">Dispatched</span>
        </div>
      ),
      color: "orange",
    },
    {
      value: "accepted",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
          <span className="font-medium">Accepted</span>
        </div>
      ),
      color: "green",
    },
    {
      value: "rejected",
      label: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></div>
          <span className="font-medium">Rejected</span>
        </div>
      ),
      color: "red",
    },
  ];

  const transferTypeOptions = [
    {
      value: "1",
      label: (
        <div className="flex items-center gap-2">
          <span className="font-medium">Show Only</span>
        </div>
      ),
    },
  ];

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | undefined
  ) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.color || "default";
  };

  const getEssentialFiltersCount = () => {
    const essentialKeys = ["status"];
    return Object.keys(filters).filter((key) => essentialKeys.includes(key))
      .length;
  };

  const getAdvancedFiltersCount = () => {
    const advancedKeys = ["out_going", "in_coming"];
    return Object.keys(filters).filter((key) => advancedKeys.includes(key))
      .length;
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
              <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                <Icon
                  icon="mdi:filter-variant"
                  className="w-5 h-5 text-blue-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-lg">
                  Transfer Filters
                </span>
                {getActiveFiltersCount() > 0 && (
                  <Badge
                    count={getActiveFiltersCount()}
                    style={{
                      backgroundColor: "#3b82f6",
                      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
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
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl px-4 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
            {/* Status Filter */}
            <div className="flex flex-col gap-2 min-w-[160px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Icon icon="mdi:circle-outline" className="w-3 h-3" />
                Status
              </label>
              <Select
                placeholder={
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon icon="mdi:circle-outline" className="w-4 h-4" />
                    <span>All Status</span>
                  </div>
                }
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
                style={{ minWidth: 160 }}
                className="custom-select"
                options={statusOptions}
                dropdownStyle={{
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
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
                  Transfer Direction
                </span>
              </div>

              <div className="flex flex-wrap gap-4 items-center w-full">
                {/* Outgoing Filter */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Icon icon="mdi:arrow-top-right" className="w-3 h-3" />
                    Outgoing
                  </label>
                  <Select
                    placeholder={
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon icon="mdi:arrow-top-right" className="w-4 h-4" />
                        <span>All</span>
                      </div>
                    }
                    value={filters.out_going}
                    onChange={(value) => handleFilterChange("out_going", value)}
                    allowClear
                    style={{ minWidth: 140 }}
                    className="custom-select"
                    options={transferTypeOptions}
                    dropdownStyle={{
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>

                {/* Incoming Filter */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Icon icon="mdi:arrow-bottom-left" className="w-3 h-3" />
                    Incoming
                  </label>
                  <Select
                    placeholder={
                      <div className="flex items-center gap-2 text-gray-500">
                        <Icon
                          icon="mdi:arrow-bottom-left"
                          className="w-4 h-4"
                        />
                        <span>All</span>
                      </div>
                    }
                    value={filters.in_coming}
                    onChange={(value) => handleFilterChange("in_coming", value)}
                    allowClear
                    style={{ minWidth: 140 }}
                    className="custom-select"
                    options={transferTypeOptions}
                    dropdownStyle={{
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
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
                {filters.status && (
                  <Tag
                    closable
                    onClose={() => handleFilterChange("status", undefined)}
                    color={getStatusColor(filters.status)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:circle" className="w-3 h-3" />
                    Status:{" "}
                    {filters.status.charAt(0).toUpperCase() +
                      filters.status.slice(1)}
                  </Tag>
                )}
                {filters.out_going && (
                  <Tag
                    closable
                    onClose={() => handleFilterChange("out_going", undefined)}
                    color="orange"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:arrow-top-right" className="w-3 h-3" />
                    Outgoing Only
                  </Tag>
                )}
                {filters.in_coming && (
                  <Tag
                    closable
                    onClose={() => handleFilterChange("in_coming", undefined)}
                    color="cyan"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon icon="mdi:arrow-bottom-left" className="w-3 h-3" />
                    Incoming Only
                  </Tag>
                )}
              </Space>
            </div>
          )}

          {/* Custom CSS for Select components */}
          <style jsx>{`
            :global(.custom-select .ant-select-selector) {
              border-radius: 12px !important;
              border: 1px solid #e5e7eb !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
              transition: all 0.2s ease !important;
            }
            :global(.custom-select .ant-select-selector:hover) {
              border-color: #3b82f6 !important;
              box-shadow: 0 4px 12px 0 rgba(59, 130, 246, 0.15) !important;
            }
            :global(.custom-select.ant-select-focused .ant-select-selector) {
              border-color: #3b82f6 !important;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            }
          `}</style>
        </div>
      </Card>
    </div>
  );
};

export default StockTransferFilters;
