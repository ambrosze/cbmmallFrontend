import debounce from "@/utils/debounce";
import { LoadingOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { Select } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { ReactElement } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  data: any;
  onChange: (value: any) => void;
  value?: any;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  placeholder?: any;
  notFoundContent?: any;
  setSearchSelect?: any;
  handleSearchSelect?: any;
  className?: string;
  mode?: "multiple" | "tags" | undefined;
  tokenSeparators?: string[];
  onDeselect?: (value: any) => void;
  tagRender?: (props: CustomTagProps) => ReactElement;
  // Pagination support (optional)
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  // Behavior toggles
  preserveSelectedLabels?: boolean; // default: true
  resetSearchOnClose?: boolean; // default: true
  // Search UX
  minSearchChars?: number; // If set, don't trigger server search or show options until length met
  hideSelectedWhileSearching?: boolean; // default: true - do not show cached/selected options in menu during active search
}

const SelectInput = ({
  data,
  onChange,
  value,
  disabled,
  loading,
  backgroundColor,
  placeholder,
  notFoundContent,
  handleSearchSelect,
  setSearchSelect,
  className,
  mode = undefined,
  tokenSeparators,
  onDeselect,
  tagRender,
  hasMore,
  loadingMore,
  onLoadMore,
  preserveSelectedLabels = true,
  resetSearchOnClose = true,
  minSearchChars = 0,
  hideSelectedWhileSearching = true,
}: IProps) => {
  // Cache seen options so selected values retain labels across server searches
  const optionsCacheRef = useRef<Map<string, any>>(new Map());
  // Track current search text to control menu rendering
  const [searchText, setSearchText] = useState<string>("");

  // Keep cache updated with latest incoming options
  useEffect(() => {
    if (Array.isArray(data)) {
      data.forEach((opt) => {
        if (opt && (opt.value !== undefined || opt.key !== undefined)) {
          const key = String(opt.value ?? opt.key);
          optionsCacheRef.current.set(key, opt);
        }
      });
    }
  }, [data]);

  // Helper: normalize selected values to an array
  const selectedValuesArray = useMemo(() => {
    if (mode === "multiple" || mode === "tags") {
      return Array.isArray(value) ? value : value ? [value] : [];
    }
    return value !== undefined && value !== null ? [value] : [];
  }, [mode, value]);

  // Build fallback options only for selected values to preserve visible labels in the control
  const selectedFallbackOptions = useMemo(() => {
    if (!preserveSelectedLabels) return [] as any[];
    const result: any[] = [];
    const seen = new Set<string>();
    selectedValuesArray.forEach((val: any) => {
      const key = String(val?.value ?? val);
      if (seen.has(key)) return;
      seen.add(key);
      const cached = optionsCacheRef.current.get(key);
      if (cached) {
        result.push(cached);
      } else {
        result.push({ label: String(val?.label ?? val), value: val });
      }
    });
    return result;
  }, [preserveSelectedLabels, selectedValuesArray]);

  // Options shown in the dropdown menu
  const displayOptions = useMemo(() => {
    const base = Array.isArray(data) ? data : [];

    // If using server search and min length is not met, show nothing (but keep tags in input)
    const isServerSearch = typeof handleSearchSelect === "function";
    const isActiveSearch = searchText.length > 0;
    if (
      isServerSearch &&
      isActiveSearch &&
      minSearchChars > 0 &&
      searchText.length < minSearchChars
    ) {
      return [] as any[];
    }

    // While actively searching with server-side filtering, avoid showing cached/selected options
    if (isServerSearch && isActiveSearch && hideSelectedWhileSearching) {
      return base;
    }

    // When not actively searching, we can include fallbacks for selected values (so they appear in menu too)
    if (!isActiveSearch && preserveSelectedLabels) {
      const map = new Map<string, any>();
      base.forEach((opt) => {
        const k = String(opt?.value ?? opt?.key);
        if (k !== "undefined") map.set(k, opt);
      });
      selectedFallbackOptions.forEach((opt) => {
        const k = String(opt?.value ?? opt?.key);
        if (k !== "undefined" && !map.has(k)) map.set(k, opt);
      });
      return Array.from(map.values());
    }

    return base;
  }, [
    data,
    handleSearchSelect,
    hideSelectedWhileSearching,
    minSearchChars,
    preserveSelectedLabels,
    searchText,
    selectedFallbackOptions,
  ]);

  // Reset server search when dropdown closes, so next open shows broad results
  const prevOpenRef = useRef<boolean>(false);
  const handleDropdownVisibleChange = (open: boolean) => {
    if (!open && prevOpenRef.current) {
      if (resetSearchOnClose && typeof handleSearchSelect === "function") {
        handleSearchSelect("");
      }
      // Clear local search for next open
      setSearchText("");
    }
    prevOpenRef.current = open;
  };

  // Debounce infinite scroll load-more to avoid spamming
  const debouncedLoadMore = useMemo(
    () =>
      debounce(() => {
        if (hasMore && !loadingMore && typeof onLoadMore === "function") {
          onLoadMore();
        }
      }, 250),
    [hasMore, loadingMore, onLoadMore]
  );

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || loadingMore) return;
    const target = e.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 24;
    if (nearBottom) debouncedLoadMore();
  };

  // Default tag renderer that replaces the close "x" with a delete icon
  const defaultTagRender = (props: CustomTagProps): ReactElement => {
    const { label, value, closable, onClose } = props;
    const preventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // In tags mode, use the value as the display text if label is not available
    const displayText = mode === "tags" ? label || value : label;

    return (
      <span
        className="ant-select-selection-item flex items-center gap-1"
        title={String(displayText)}
      >
        <span className="ant-select-selection-item-content text-sm font-semibold">
          {displayText}
        </span>
        {closable && (
          <span
            onMouseDown={preventMouseDown}
            className="ant-select-selection-item-remove cursor-pointer text-red-500 hover:opacity-70"
            onClick={onClose}
          >
            <Icon
              icon="mdi:trash-can-outline"
              width={14}
              height={14}
              className="text-red-500"
            />
          </span>
        )}
      </span>
    );
  };
  // console.log('🚀 ~ SelectInput ~ value:', value)

  // Support both single and array values (for multiple/tags modes)
  const handleChange = (selectedValue: any): void => {
    onChange(selectedValue); // Pass the selected value directly
  };

  // Avoid re-invoking onChange when the controlled value prop updates to prevent loops

  // Intercept search events: enforce minSearchChars before delegating to parent
  const handleSearch = (term: string) => {
    setSearchText(term);
    if (typeof handleSearchSelect === "function") {
      if (
        !minSearchChars ||
        term.length >= minSearchChars ||
        term.length === 0
      ) {
        handleSearchSelect(term);
      }
    }
  };

  const computedNotFoundContent = useMemo(() => {
    const isServerSearch = typeof handleSearchSelect === "function";
    if (
      isServerSearch &&
      searchText.length > 0 &&
      minSearchChars > 0 &&
      searchText.length < minSearchChars
    ) {
      return (
        <span className="text-xs text-gray-500">
          Type at least {minSearchChars} character
          {minSearchChars > 1 ? "s" : ""} to search
        </span>
      );
    }
    return notFoundContent;
  }, [handleSearchSelect, minSearchChars, notFoundContent, searchText]);

  return (
    <div
      className={twMerge(
        "w-full rounded-[8px] border border-[#dfdcdc] p-[1px] text-sm hover:border-primary-40 focus:outline-none focus:ring-1 focus:ring-darkColor",
        className
      )}
    >
      {/* Compute whether to show load more in the dropdown */}
      {(() => null)()}
      <Select
        showSearch
        mode={mode}
        allowClear
        loading={loading}
        suffixIcon={loading ? <LoadingOutlined spin /> : undefined}
        variant="borderless"
        value={value}
        size="large"
        placeholder={placeholder}
        className="w-full rounded-[8px] !placeholder:text-sm !placeholder:font-light text-sm"
        disabled={disabled || loading}
        onChange={handleChange}
        onDeselect={onDeselect}
        options={displayOptions}
        notFoundContent={computedNotFoundContent}
        onSearch={handleSearch}
        tagRender={mode ? tagRender || defaultTagRender : undefined}
        // Allow splitting tags by common separators when in tags mode
        tokenSeparators={mode === "tags" ? tokenSeparators ?? [","] : undefined}
        optionLabelProp={mode === "tags" ? "value" : "label"}
        labelRender={
          mode === "tags"
            ? undefined
            : (option) =>
                (
                  <span className="text-sm font-[500]">{option.label}</span>
                ) as unknown as ReactElement
        }
        optionFilterProp={mode === "tags" ? "value" : "label"}
        filterOption={
          handleSearchSelect
            ? false
            : (input, option) => {
                const searchText =
                  mode === "tags" ? option?.value : option?.label;
                return (
                  typeof searchText === "string" &&
                  searchText.toLowerCase().includes(input.toLowerCase())
                );
              }
        }
        onPopupScroll={handlePopupScroll}
        onOpenChange={handleDropdownVisibleChange}
        popupRender={(menu) => {
          const isServerSearch = typeof handleSearchSelect === "function";
          const blockFooter =
            isServerSearch &&
            searchText.length > 0 &&
            minSearchChars > 0 &&
            searchText.length < minSearchChars;
          const showFooter = hasMore && !blockFooter;
          return (
            <div>
              {menu}
              {showFooter ? (
                <div className="py-2 px-3 border-t border-gray-100 flex items-center justify-center">
                  {loadingMore ? (
                    <span className="text-xs text-gray-500 flex items-center gap-2">
                      <LoadingOutlined spin /> Loading more...
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-primary-40 hover:underline"
                      onClick={() => onLoadMore && onLoadMore()}
                    >
                      Load more
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          );
        }}
      />
    </div>
  );
};

export default SelectInput;
