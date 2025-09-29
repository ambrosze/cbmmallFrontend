import { useGetAllCustomersQuery } from "@/services/customers";
import { useGetAllEnumsQuery } from "@/services/global";
import { AdminDiscountDatum } from "@/types/discountTypes";
import { formatCurrency } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import SelectInput from "../Input/SelectInput";
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
  inventoryData: any;
  discountData: AdminDiscountDatum[]; // legacy; not used for this form currently
  isLoadingDiscount?: boolean; // legacy; not used for this form currently
  debouncedInventorySearch: (q: string) => void;
  debouncedDiscountSearch: (q: string) => void;
}

export const SalesForm = ({
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
  discountData,
  isLoadingDiscount,
  debouncedInventorySearch,
  debouncedDiscountSearch,
}: IProps) => {
  console.log("🚀 ~ SalesForm ~ discountData:", discountData);
  const { data, isLoading } = useGetAllEnumsQuery(
    {
      enum: "PaymentMethod",
    },
    { refetchOnMountOrArgChange: true }
  );
  const { data: customerData, isLoading: isLoadingCustomers } =
    useGetAllCustomersQuery({}, { refetchOnMountOrArgChange: true });

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
    const updatedItems = [...(formValues.sale_inventories || [])];

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
      sale_inventories: updatedItems,
    });
  };

  const addItem = () => {
    const items = [...(formValues.sale_inventories || [])];
    items.push({
      inventory_id: "",
      quantity: "",
      cost_price: "",
    });

    setFormValues({
      ...formValues,
      sale_inventories: items,
    });
  };

  const removeItem = (index: number) => {
    const items = [...(formValues.sale_inventories || [])];
    items.splice(index, 1);

    setFormValues({
      ...formValues,
      sale_inventories: items,
    });
  };

  return (
    <div>
      <form className="mt-5 flex flex-col gap-3 w-full">
        <div className="flex lg:flex-row flex-col gap-5 w-full">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-[500] capitalize text-[#2C3137]"}>
                Customer name*
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, customer_id: value });
              }}
              loading={isLoadingCustomers}
              value={formValues.customer_id || undefined}
              placeholder={
                <span className="text-sm font-bold">Select customer</span>
              }
              className="py-[3px]"
              data={
                customerData?.data?.map((customer) => ({
                  label: customer.name,
                  value: customer.id,
                })) || []
              }
            />
            {getFieldErrors("customer_id") || getFieldErrors("buyer_id") ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {getFieldErrors("customer_id") || getFieldErrors("buyer_id")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-5">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-[500] capitalize text-[#2C3137]"}>
                Payment Method*
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, payment_method: value });
              }}
              loading={isLoading}
              value={formValues.payment_method || undefined}
              placeholder={
                <span className="text-sm font-bold">Select payment method</span>
              }
              className="py-[3px]"
              data={
                data?.values?.map((enumValue) => ({
                  label: enumValue.name,
                  value: enumValue.value,
                })) || []
              }
            />
            {formErrors.payment_method || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.payment_method ||
                  (error as any)?.data?.errors?.payment_method?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm font-[500] capitalize text-[#2C3137]"}>
                Discount Code
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, discount_code: value });
              }}
              loading={isLoadingDiscount}
              value={formValues.discount_code || undefined}
              placeholder={
                <span className="text-sm font-bold">Select discount code</span>
              }
              handleSearchSelect={(q: string) => {
                // Call debounced search function
                // to avoid excessive API calls
                debouncedDiscountSearch(q ?? "");
              }}
              className="py-[3px]"
              data={
                discountData?.map((item) => ({
                  label: item.code,
                  value: item.code,
                })) || []
              }
            />
            {formErrors.discount_code || error ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.discount_code ||
                  (error as any)?.data?.errors?.discount_code?.map(
                    (err: any) => err
                  ) ||
                  ""}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg">Sale Items</h3>
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

          {(formValues.sale_inventories || []).map(
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
                      className="py-[3px]"
                      value={item.inventory_id || undefined}
                      placeholder={
                        <span className="text-sm">Select inventory item</span>
                      }
                      handleSearchSelect={(q: string) => {
                        debouncedInventorySearch(q ?? "");
                      }}
                      data={inventoryData || []}
                    />
                    <span className="text-[12px] italic text-error-50">
                      {getFieldErrors(
                        `sale_inventories.${index}.inventory_id`,
                        [
                          `sale_inventories[${index}].inventory_id`,
                          `sale_inventories.${index}[inventory_id]`,
                          `sale_inventories[${index}][inventory_id]`,
                        ]
                      )}
                    </span>
                  </div>

                  <div>
                    <TextInput
                      type="number"
                      name={`sale_inventories[${index}][quantity]`}
                      className="py-[13px]"
                      errorMessage={getFieldErrors(
                        `sale_inventories.${index}.quantity`,
                        [
                          `sale_inventories[${index}].quantity`,
                          `sale_inventories.${index}[quantity]`,
                          `sale_inventories[${index}][quantity]`,
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
                      name={`sale_inventories[${index}][cost_price]`}
                      className="py-[13px]"
                      readOnly={true}
                      errorMessage={
                        formErrors[`sale_inventories.${index}.cost_price`] ||
                        (error as any)?.data?.errors?.[
                          `sale_inventories.${index}.cost_price`
                        ]?.map((err: any) => err) ||
                        ""
                      }
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

          {(!formValues.sale_inventories ||
            formValues.sale_inventories.length === 0) && (
            <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
              No items added yet. Click "Add Item" to add sale items.
            </div>
          )}
        </div>

        {/* Grand total */}
        <div className="border-t border-gray-300 pt-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium">Grand total</span>
            <span className="text-lg font-semibold">
              {(() => {
                const items = formValues.sale_inventories || [];
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
