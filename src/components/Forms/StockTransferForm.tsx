import { formatCurrency } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";
import PhoneInputWithCountry from "../Input/PhoneInputWithCountry";
import SelectInput from "../Input/SelectInput";
import TextAreaInput from "../Input/TextAreaInput";
import TextInput from "../Input/TextInput";
import CustomButton from "../sharedUI/Buttons/Button";
import Spinner from "../sharedUI/Spinner";

interface IProps {
  formErrors: any;
  error: any;
  formValues: any;
  handleInputChange: any;
  setFormValues: any;
  handleSubmit: any;
  isLoadingCreate: boolean;
  setIsOpenModal: any;
  btnText: string;
  inventoryData?: any;
  dailyGoldPrices?: any[];
  storeData?: any[];
  debouncedInventorySearch?: (q: string) => void;
}

export const StockTransferForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
  inventoryData,
  dailyGoldPrices,
  storeData,
  debouncedInventorySearch,
}: IProps) => {
  // Helper to extract error messages for various possible key formats
  const getFieldErrors = (fieldKey: string, altKeys: string[] = []): string => {
    const serverErrors = (error as any)?.data?.errors || {};
    const clientErrors = formErrors || {};
    const keysToTry = [fieldKey, ...altKeys];

    for (const key of keysToTry) {
      const fromClient = clientErrors?.[key];
      if (fromClient)
        return Array.isArray(fromClient) ? fromClient.join(", ") : fromClient;

      const fromServer = serverErrors?.[key];
      if (fromServer)
        return Array.isArray(fromServer)
          ? fromServer.join(", ")
          : String(fromServer);
    }
    return "";
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...(formValues.stock_transfer_inventories || [])];

    if (!updatedItems[index]) {
      updatedItems[index] = {};
    }

    if (field === "inventory_id") {
      // set inventory_id
      updatedItems[index].inventory_id = value;

      // find the selected inventory option
      const inv = (inventoryData || []).find((i: any) => i.value === value);
      // auto-fill available quantity (can be edited by user later)
      if (inv && inv.quantity !== undefined) {
        updatedItems[index].quantity = inv.quantity;
      }
      // auto-fill cost price (read-only field)
      if (inv && inv.cost_price !== undefined) {
        updatedItems[index].cost_price = inv.cost_price;
      }
    } else {
      updatedItems[index][field] = value;
    }

    setFormValues({
      ...formValues,
      stock_transfer_inventories: updatedItems,
    });
  };

  const addItem = () => {
    const items = [...(formValues.stock_transfer_inventories || [])];
    items.push({
      inventory_id: "",
      quantity: "",
      cost_price: "",
    });

    setFormValues({
      ...formValues,
      stock_transfer_inventories: items,
    });
  };

  const removeItem = (index: number) => {
    const items = [...(formValues.stock_transfer_inventories || [])];
    items.splice(index, 1);

    setFormValues({
      ...formValues,
      stock_transfer_inventories: items,
    });
  };

  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex lg:flex-row flex-col gap-5 w-full">
          <div className="w-full">
            <TextInput
              type="text"
              name="driver_name"
              errorMessage={
                formErrors.driver_name ||
                (error as any)?.data?.errors?.driver_name?.map(
                  (err: any) => err
                ) ||
                ""
              }
              className="py-[13px]"
              value={formValues.driver_name}
              onChange={handleInputChange}
              placeholder="Enter driver name"
              title={<span className="font-[500]">Driver Name*</span>}
              required={true}
            />
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label
                className={twMerge(
                  "text-sm font-[500] capitalize text-[#2C3137]"
                )}
              >
                Driver Phone Number*
              </label>
            </div>
            <PhoneInputWithCountry
              disabled={false}
              value={formValues.driver_phone_number}
              className=""
              onChange={(value) => {
                setFormValues((prevValues: any) => ({
                  ...prevValues,
                  driver_phone_number: value,
                }));
              }}
              placeholder="Enter driver phone number"
            />
            <span className="relative -top-1 text-[12px] italic text-error-50">
              {formErrors.driver_phone_number ||
                (error as any)?.data?.errors?.driver_phone_number?.map(
                  (err: any) => err
                ) ||
                ""}
            </span>
          </div>
        </div>

        <div className="w-full">
          <div className={`pb-1`}>
            <label className={"text-sm font-[500] capitalize text-[#2C3137]"}>
              Destination Store*
            </label>
          </div>
          <SelectInput
            onChange={(value) => {
              setFormValues({ ...formValues, to_store_id: value });
            }}
            value={formValues.to_store_id || undefined}
            placeholder={
              <span className="text-sm font-bold">
                Select destination store
              </span>
            }
            className="py-[3px]"
            data={storeData || []}
          />
          {formErrors.to_store_id || error ? (
            <p className="flex flex-col gap-1 text-xs italic text-red-600">
              {formErrors.to_store_id ||
                (error as any)?.data?.errors?.to_store_id?.map(
                  (err: any) => err
                ) ||
                ""}
            </p>
          ) : null}
        </div>

        <div className="w-full">
          <TextAreaInput
            name="comment"
            title={<span className="font-[500]">Comment</span>}
            className="w-full"
            errorMessage={
              formErrors.comment ||
              (error as any)?.data?.errors?.comment?.map((err: any) => err) ||
              ""
            }
            row={3}
            value={formValues.comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFormValues({ ...formValues, comment: e.target.value });
            }}
            placeholder="Enter comment (optional)"
            required={false}
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg">Stock Transfer Items</h3>
            <div className="">
              <CustomButton
                type="button"
                onClick={addItem}
                className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-3 py-1"
              >
                <Icon icon="line-md:plus" width="16" height="16" />
                Add Item
              </CustomButton>
            </div>
          </div>

          {(formValues.stock_transfer_inventories || []).map(
            (item: any, index: number) => (
              <div key={index} className="p-4 border rounded-md mb-3 relative">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <Icon icon="line-md:close" width="20" height="20" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <div className={`pb-1`}>
                      <label
                        className={
                          "text-sm font-[500] capitalize text-[#2C3137]"
                        }
                      >
                        Inventory Item*
                      </label>
                    </div>
                    <SelectInput
                      onChange={(value) =>
                        handleItemChange(index, "inventory_id", value)
                      }
                      className="py-[3px] "
                      value={item.inventory_id || undefined}
                      placeholder={
                        <span className="text-sm">Select inventory item</span>
                      }
                      handleSearchSelect={(q: string) => {
                        debouncedInventorySearch?.(q ?? "");
                      }}
                      data={inventoryData || []}
                    />
                    <span className="text-[12px] italic text-error-50">
                      {getFieldErrors(
                        `stock_transfer_inventories.${index}.inventory_id`,
                        [
                          `stock_transfer_inventories[${index}].inventory_id`,
                          `stock_transfer_inventories.${index}[inventory_id]`,
                          `stock_transfer_inventories[${index}][inventory_id]`,
                        ]
                      )}
                    </span>
                  </div>

                  <div>
                    <TextInput
                      type="number"
                      name={`stock_transfer_inventories[${index}][quantity]`}
                      className="py-[13px]"
                      errorMessage={getFieldErrors(
                        `stock_transfer_inventories.${index}.quantity`,
                        [
                          `stock_transfer_inventories[${index}].quantity`,
                          `stock_transfer_inventories.${index}[quantity]`,
                          `stock_transfer_inventories[${index}][quantity]`,
                        ]
                      )}
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      placeholder="Enter quantity"
                      title={<span className="font-[500]">Quantity*</span>}
                      required={true}
                      helperText={`Available: ${
                        (inventoryData || []).find(
                          (opt: any) => opt.value === item.inventory_id
                        )?.quantity ?? "-"
                      }`}
                    />
                  </div>

                  <div>
                    <TextInput
                      type="number"
                      name={`stock_transfer_inventories[${index}][cost_price]`}
                      className="py-[13px]"
                      readOnly={true}
                      errorMessage={getFieldErrors(
                        `stock_transfer_inventories.${index}.cost_price`,
                        [
                          `stock_transfer_inventories[${index}].cost_price`,
                          `stock_transfer_inventories.${index}[cost_price]`,
                          `stock_transfer_inventories[${index}][cost_price]`,
                        ]
                      )}
                      value={item.cost_price}
                      onChange={() => {}}
                      placeholder="Auto cost price"
                      title={
                        <span className="font-[500]">
                          Cost Price (readonly)
                        </span>
                      }
                      required={false}
                    />
                  </div>
                </div>
                {/* Per-item total */}
                <div className="mt-3 text-sm text-gray-700 flex items-center justify-between">
                  <span className="font-medium">Item total:</span>
                  <span className="font-semibold">
                    {(() => {
                      const qty = Number(item.quantity) || 0;
                      const price = Number(item.cost_price) || 0;
                      return formatCurrency(qty * price);
                    })()}
                  </span>
                </div>
              </div>
            )
          )}

          {(!formValues.stock_transfer_inventories ||
            formValues.stock_transfer_inventories.length === 0) && (
            <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
              No items added yet. Click "Add Item" to add transfer items.
            </div>
          )}
        </div>

        {/* Grand total */}
        <div className="border-t border-gray-300 pt-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium">Grand total</span>
            <span className="text-lg font-semibold">
              {(() => {
                const items = formValues.stock_transfer_inventories || [];
                const total = items.reduce((sum: number, cur: any) => {
                  const qty = Number(cur?.quantity) || 0;
                  const price = Number(cur?.cost_price) || 0;
                  return sum + qty * price;
                }, 0);
                return formatCurrency(total);
              })()}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <div className="w-fit flex gap-5">
            <CustomButton
              type="button"
              onClick={() => {
                setIsOpenModal(false);
              }}
              className="border bg-border-300 text-black flex justify-center items-center gap-2 px-5"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="button"
              onClick={handleSubmit}
              disabled={isLoadingCreate}
              className="border bg-primary-40 flex justify-center items-center gap-2 text-white px-5"
            >
              {isLoadingCreate ? <Spinner className="border-white" /> : btnText}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
};
