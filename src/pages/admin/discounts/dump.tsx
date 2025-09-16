import Header from "@/components/header";
import SelectInput from "@/components/Input/SelectInput";
import TextInput from "@/components/Input/TextInput";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

const index = () => {
  const [search, setSearch] = useState<string>("");
  const [priceUpdate, setPriceUpdate] = useState("₦59.70");
  return (
    <div className={``}>
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <SharedLayout className="bg-white">
        <div className="border-b mt-20 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Point of sale</h1>
          <div className="flex items-center gap-3">
            <CustomButton
              onClick={() => {}}
              className="bg-white text-[#212529] px-3 border border-[#CED4DA] rounded-[4px] hover:bg-[#F8F9FA]"
            >
              Drafts
            </CustomButton>
          </div>
        </div>
        {/* stats */}
        <div className="border p-5 rounded-[4px] border-[#B9BDC7] mt-5 flex items-center justify-between gap-20">
          <div className="w-[40%]">
            <h3 className="font-semibold text-lg mb-5">Today’s Gold Rate</h3>
            <div className="flex gap-3 items-end">
              <div className="w-full">
                <TextInput
                  type="text"
                  name="goldRate"
                  labelClassName="text-xs font-[500]"
                  title="Price per gram (USD)"
                  placeholder="Enter Gold Rate"
                  className="w-full"
                  value={priceUpdate}
                  onChange={(e) => setPriceUpdate(e.target.value)}
                />
              </div>
              <div className="w-[245px]">
                <CustomButton
                  onClick={() => {}}
                  className="bg-black text-white flex items-center gap-2 px-3 rounded-[4px] hover:bg-[#212529] justify-center"
                >
                  <Icon
                    icon="bi:arrow-clockwise"
                    className="text-white"
                    width="16"
                    height="16"
                  />
                  Update Price
                </CustomButton>
              </div>
            </div>
          </div>
          <div className=" p-3 rounded-[4px]  mt-5 flex items-center justify-between gap-10 bg-[#F0F1F3] w-[55%]">
            <div className="flex flex-col gap-3 w-1/2">
              <h3 className="font-semibold flex items-center gap-2 text-lg">
                <Icon icon="mdi:chart-line" width="24" height="24" />
                Market overview
              </h3>
              <div className="p-2 bg-white rounded-[4px] ">
                <p className="text-[#2B2F38] text-[14px] ">Previous Price</p>
                <p className="text-[#212529] text-[16px] font-[500]">₦59.70</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-1/2">
              <h3 className="font-semibold  gap-2 text-right">
                Last updated: Jan 15 2025
              </h3>
              <div className="p-2 bg-white rounded-[4px] ">
                <p className="text-[#2B2F38] text-[14px] ">24h Change</p>
                <p className="text-[#12B76A] text-[16px] font-[500]">+2.3%</p>
              </div>
            </div>
          </div>
        </div>
        {/* sales history */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="p-3 rounded-[4px] shadow-f1 border border-[#F0F1F3] flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Cashier</h3>
            <div className="">
              <TextInput
                type="text"
                name="cashier"
                onChange={() => {}}
                value={""}
                placeholder="Enter Cashier Name"
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-3 pb-6">
              <div className="w-full">
                <TextInput
                  type="text"
                  name="cashier"
                  onChange={() => {}}
                  value={"Patience Jane"}
                  placeholder="Discount code"
                  className="w-full"
                />
              </div>
              <CustomButton
                onClick={() => {}}
                className="bg-white w-[30%] hover:opacity-50 border rounded-lg"
              >
                Apply
              </CustomButton>
            </div>
          </div>
          <div className="p-3 rounded-[4px] shadow-f1 border border-[#F0F1F3] flex flex-col gap-3">
            <div className="h-full flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <p className="flex text-sm font-[500] justify-between">
                  <span className="">Subtotal</span>
                  <span className="font-bold">N20,000.00</span>
                </p>
                <p className="flex text-sm font-[500] justify-between">
                  <span className="">Tax (10%)</span>
                  <span className="font-bold">N1,600.00</span>
                </p>
              </div>
              <div className="border-t">
                <p className="flex text-sm py-3 font-[500] justify-between">
                  <span className="">Tax (10%)</span>
                  <span className="font-bold">N21,600.00</span>
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-[4px] shadow-f1 border border-[#F0F1F3] flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Payment method</h3>
            <div className="w-full">
              <SelectInput
                onChange={(value) => {}}
                value={undefined}
                placeholder={<span className="text-sm font-bold">Method</span>}
                data={[
                  { label: "Cash", value: "cash" },
                  { label: "ATM", value: "ATM" },
                  { label: "Transfer", value: "transfer" },
                  { label: "Cheque", value: "cheque" },
                ]}
              />
            </div>
            <CustomButton
              onClick={() => {}}
              className="bg-primary-40 text-white flex items-center gap-2 px-3 rounded-[4px] hover:bg-[#212529] justify-center"
            >
              <Icon icon="quill:creditcard" width="22" height="22" />
              Process Payment
            </CustomButton>
            <CustomButton
              onClick={() => {}}
              className="bg-white text-black flex items-center gap-2 px-3 rounded-[4px] hover:bg-[#212529] justify-center border"
            >
              <Icon icon="mdi:printer-outline" width="24" height="24" />
              Print Receipt
            </CustomButton>
          </div>
        </div>
        {/* table */}
        <div className="mt-5">table</div>
      </SharedLayout>
    </div>
  );
};

export default index;
