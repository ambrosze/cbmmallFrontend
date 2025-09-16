import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps, Radio } from "antd";
import { useState } from "react";
import CustomButton from "./Buttons/Button";

interface MenuItem {
  key: string;
  label: string;
}

interface IProps {
  headerText: string;
  selectedFilterTypes: MenuItem | null;
  setSelectedFilterTypes: (item: MenuItem | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PrimaryFilter = ({
  headerText,
  selectedFilterTypes,
  setSelectedFilterTypes,
  isOpen,
  setIsOpen,
}: IProps) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "All categories",
      children: [
        {
          key: "1-1",
          label: "1st menu item",
        },
        {
          key: "1-2",
          label: "2nd menu item",
        },
      ],
    },
    {
      key: "2",
      label: "All colors",
      children: [
        {
          key: "2-1",
          label: "3rd menu item",
        },
        {
          key: "2-2",
          label: "4th menu item",
        },
      ],
    },
    {
      key: "3",
      label: "All types",
      children: [
        {
          key: "3-1",
          label: "5d menu item",
        },
        {
          key: "3-2",
          label: "6th menu item",
        },
      ],
    },
    {
      key: "4",
      label: "All locations",
      children: [
        {
          key: "4-1",
          label: "5d menu item",
        },
        {
          key: "4-2",
          label: "6th menu item",
        },
      ],
    },
  ];
  const [openSelectedItem, setOpenSelectedItem] = useState(null);
  const filterList = [
    {
      id: "1",
      title: "All categories",
      items: [
        {
          label: (
            <a
              href="https://www.antgroup.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              1st menu item
            </a>
          ),
          key: "0",
        },
        {
          label: (
            <a
              href="https://www.aliyun.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              2nd menu item
            </a>
          ),
          key: "1",
        },

        {
          label: "3rd menu item",
          key: "3",
        },
      ],
    },
    {
      id: "2",
      title: "All colors",
      items: [
        {
          label: (
            <a
              href="https://www.antgroup.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              1st menu item
            </a>
          ),
          key: "0",
        },
        {
          label: (
            <a
              href="https://www.aliyun.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              2nd menu item
            </a>
          ),
          key: "1",
        },

        {
          label: "3rd menu item",
          key: "3",
        },
      ],
    },
    {
      id: "3",
      title: "All types",
      items: [
        {
          label: (
            <a
              href="https://www.antgroup.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              1st menu item
            </a>
          ),
          key: "0",
        },
        {
          label: (
            <a
              href="https://www.aliyun.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              2nd menu item
            </a>
          ),
          key: "1",
        },

        {
          label: "3rd menu item",
          key: "3",
        },
      ],
    },
    {
      id: "4",
      title: "All locations",
      items: [
        {
          label: (
            <a
              href="https://www.antgroup.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              1st menu item
            </a>
          ),
          key: "0",
        },
        {
          label: (
            <a
              href="https://www.aliyun.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              2nd menu item
            </a>
          ),
          key: "1",
        },

        {
          label: "3rd menu item",
          key: "3",
        },
      ],
    },
    {
      id: "5",
      title: "Sort by",
      items: [
        {
          label: (
            <a
              href="https://www.antgroup.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alphabetical
            </a>
          ),
          key: "0",
        },
        {
          label: (
            <a
              href="https://www.aliyun.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lowest stock first
            </a>
          ),
          key: "1",
        },
        {
          label: "Highest stock first",
          key: "3",
        },
      ],
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "all") {
      setSelectedFilterTypes(null);
    } else {
      const findNestedItem = (items: any[]): MenuItem | null => {
        for (const item of items) {
          if (item.key === e.key) return item;
          if (item.children) {
            const found = findNestedItem(item.children);
            if (found) return found;
          }
        }
        return null;
      };

      const selectedItem = findNestedItem(menuItems as any[]);
      if (selectedItem) {
        setSelectedFilterTypes(selectedItem);
        // Only close if it's a parent item
        const isParentItem = menuItems?.some((item: any) => item.key === e.key);
        if (isParentItem) {
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <div className="bg-white border border-[#858D9D] w-[350px]  rounded-md z-30 absolute right-0 top-11">
      <div className="flex justify-between items-center px-3 pt-3">
        <Icon
          onClick={() => setIsOpen(false)}
          className="cursor-pointer hover:opacity-50"
          icon="material-symbols:close-rounded"
          width="24"
          height="24"
        />
        <div className="flex items-center gap-3">
          <CustomButton
            onClick={() => {}}
            className="border px-5 bg-[#D0D3D9] text-white"
          >
            Reset
          </CustomButton>
          <CustomButton
            onClick={() => {}}
            className="border px-5 bg-primary-40 text-white"
          >
            Apply
          </CustomButton>
        </div>
      </div>
      <h3 className="font-semibold mt-5 px-3">Filters</h3>
      <div className="flex flex-col gap-5 my-5">
        {filterList.map((filterItem) => {
          return (
            <div
              className={` cursor-pointer    border-gray-200 ${
                filterItem?.id === "5" ? "border-b-0" : "border-b"
              }`}
            >
              {filterItem.id !== "5" && (
                <Dropdown
                  menu={{
                    items: filterItem.items,
                    className: "absolute left-[350px] w-fit",
                  }}
                  trigger={["click"]}
                >
                  <div className="px-3 hover:opacity-60 duration-75 flex justify-between items-center">
                    <h3 className="font-[500] text-[#383E49] text-sm">
                      {filterItem.title}
                    </h3>
                    <Icon
                      className="font-[500]  text-[#383E49] text-sm"
                      icon={"iconamoon:arrow-right-2-light"}
                      width="24"
                      height="24"
                    />
                  </div>
                </Dropdown>
              )}
              {filterItem.id === "5" && (
                <div className="px-3 flex flex-col ">
                  <div className=" flex  justify-between items-center ">
                    <h3 className="font-[700] text-[#383E49] text-sm">
                      {filterItem.title}
                    </h3>
                    <Icon
                      className="font-[500]  text-[#383E49] text-sm"
                      icon={"iconamoon:arrow-right-2-light"}
                      width="24"
                      height="24"
                    />
                  </div>
                  <div className="mt-3">
                    <Radio.Group
                      name="radiogroup"
                      className="flex flex-col gap-3 w-full"
                    >
                      {filterItem?.items.map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between w-full cursor-pointer hover:opacity-60 duration-75"
                        >
                          <span className="order-1 text-[#383E49] text-base">
                            {item.label}
                          </span>
                          <Radio
                            value={item.key}
                            className="order-2"
                            onChange={(e) =>
                              handleMenuClick({
                                key: e.target.value,
                              })
                            }
                          />
                        </label>
                      ))}
                    </Radio.Group>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrimaryFilter;
