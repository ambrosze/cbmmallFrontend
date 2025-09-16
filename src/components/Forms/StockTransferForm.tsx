import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
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
}: IProps) => {
  const [getDialCode, setGetDialCode] = useState("");

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...(formValues.stock_transfer_inventories || [])];

    if (!updatedItems[index]) {
      updatedItems[index] = {};
    }

    if (field === "inventory_id") {
      // set inventory_id
      updatedItems[index].inventory_id = value;
      // find its category, then find today's gold price for that category
      const inv = inventoryData.find((i: any) => i.value === value);
      const catId = inv?.category_id;
      const gp = dailyGoldPrices?.find(
        (p) => p.category_id === catId
      )?.price_per_gram;
      if (gp !== undefined) {
        updatedItems[index].price_per_gram = gp;
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
      price_per_gram: "",
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
                      data={inventoryData || []}
                    />
                    <span className="text-[12px] italic text-error-50">
                      {formErrors[
                        `stock_transfer_inventories.${index}.inventory_id`
                      ] ||
                        (error as any)?.data?.errors?.[
                          `stock_transfer_inventories.${index}.inventory_id`
                        ]?.map((err: any) => err) ||
                        ""}
                    </span>
                  </div>

                  <div>
                    <TextInput
                      type="number"
                      name={`stock_transfer_inventories[${index}][quantity]`}
                      className="py-[13px]"
                      errorMessage={
                        formErrors[
                          `stock_transfer_inventories.${index}.quantity`
                        ] ||
                        (error as any)?.data?.errors?.[
                          `stock_transfer_inventories.${index}.quantity`
                        ]?.map((err: any) => err) ||
                        ""
                      }
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      placeholder="Enter quantity"
                      title={<span className="font-[500]">Quantity*</span>}
                      required={true}
                    />
                  </div>

                  <div>
                    <TextInput
                      type="number"
                      name={`stock_transfer_inventories[${index}][price_per_gram]`}
                      className="py-[13px]"
                      errorMessage={
                        formErrors[
                          `stock_transfer_inventories.${index}.price_per_gram`
                        ] ||
                        (error as any)?.data?.errors?.[
                          `stock_transfer_inventories.${index}.price_per_gram`
                        ]?.map((err: any) => err) ||
                        ""
                      }
                      value={item.price_per_gram}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleItemChange(
                          index,
                          "price_per_gram",
                          e.target.value
                        )
                      }
                      placeholder="Enter price per gram"
                      title={
                        <span className="font-[500]">Price Per Gram*</span>
                      }
                      required={true}
                    />
                  </div>
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

        <div className="flex justify-end border-t border-gray-300 pt-3 mt-4">
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
