import { useGetAllStoresQuery } from "@/services/admin/store";
import {
  useGetAllCitiesQuery,
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from "@/services/global";
import debounce from "@/utils/debounce";
import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
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
}
export const DeliveryLocationForm = ({
  formErrors,
  error,
  formValues,
  btnText,
  handleInputChange,
  setFormValues,
  handleSubmit,
  isLoadingCreate,
  setIsOpenModal,
}: IProps) => {
  console.log("🚀 ~ DeliveryLocationForm ~ formErrors:", formErrors)
  console.log("🚀 ~ DeliveryLocationForm ~ formValues:", formValues);
  const { data: countriesData, isLoading: isLoadingCountries } =
    useGetAllCountriesQuery({});
  const [currentPage, setCurrentPage] = useState(1);
  const [storeSearch, setStoreSearch] = useState("");
  const { data: statesData, isLoading: isLoadingStates } = useGetAllStatesQuery(
    formValues.country_id
      ? {
          filter: {
            country_id: formValues.country_id || 160,
          },
        }
      : skipToken
  );
  const { data: citiesData, isLoading: isLoadingCities } = useGetAllCitiesQuery(
    formValues.state_id
      ? {
          filter: {
            country_id: formValues.country_id,
            state_id: formValues.state_id,
          },
        }
      : skipToken
  );
  const { data: storesData, isLoading: isLoadingStores } = useGetAllStoresQuery(
    {
      q: storeSearch,
      page: currentPage,
      // include: "manager",
      per_page: 50,
      paginate: true,
    }
  );
  const countryOptions = useMemo(
    () =>
      (countriesData?.data ?? []).map((country) => ({
        label: country.name,
        value: country.id,
      })),
    [countriesData]
  );
  const debouncedStoreSearch = useMemo(
    () => debounce((q: string) => setStoreSearch(q.trim()), 400),
    []
  );
  const stateOptions = useMemo(
    () =>
      (statesData?.data ?? []).map((state) => ({
        label: state.name,
        value: state.id,
      })),
    [statesData]
  );
  const cityOptions = useMemo(
    () =>
      (citiesData?.data ?? []).map((city) => ({
        label: city.name,
        value: city.id,
      })),
    [citiesData]
  );
  const storeOptions = useMemo(
    () =>
      (storesData?.data ?? []).map((store) => ({
        label: store.name,
        value: store.id,
      })),
    [storesData]
  );
  return (
    <div>
      <form className="mt-5 flex flex-col gap-5 w-full">
        <div className="flex w-full">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm"}>
                Store <span className="text-red-600">*</span>
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, store_id: value });
              }}
              value={formValues.store_id || undefined}
              placeholder={
                <span className="text-sm font-[500]">Select Store</span>
              }
              className="py-1"
              handleSearchSelect={(q: string) =>
                debouncedStoreSearch && debouncedStoreSearch(q ?? "")
              }
              data={storeOptions}
              loading={isLoadingStores}
            />
            {formErrors.store_id ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.store_id ? formErrors.store_id : ""}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm"}>
                Country <span className="text-red-600">*</span>
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({
                  ...formValues,
                  country_id: value,
                  state_id: "",
                  city_id: "",
                });
              }}
              value={formValues.country_id || undefined}
              placeholder={
                <span className="text-sm font-[500]">Select Country</span>
              }
              className="py-1"
              data={countryOptions}
              loading={isLoadingCountries}
            />
            {formErrors.country_id ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.country_id ? formErrors.country_id : ""}
              </p>
            ) : null}
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm"}>
                State <span className="text-red-600">*</span>
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, state_id: value, city_id: "" });
              }}
              value={formValues.state_id || undefined}
              placeholder={
                <span className="text-sm font-[500]">Select State</span>
              }
              className="py-1"
              data={stateOptions}
              loading={isLoadingStates}
              disabled={!formValues.country_id}
            />
            {formErrors.state_id ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.state_id ? formErrors.state_id : ""}
              </p>
            ) : null}
          </div>
          <div className="w-full">
            <div className={`pb-1`}>
              <label className={"text-sm"}>
                City <span className="text-red-600">*</span>
              </label>
            </div>
            <SelectInput
              onChange={(value) => {
                setFormValues({ ...formValues, city_id: value });
              }}
              value={formValues.city_id || undefined}
              placeholder={
                <span className="text-sm font-[500]">Select City</span>
              }
              className="py-1"
              data={cityOptions}
              loading={isLoadingCities}
              disabled={!formValues.state_id}
            />
            {formErrors.city_id ? (
              <p className="flex flex-col gap-1 text-xs italic text-red-600">
                {formErrors.city_id ? formErrors.city_id : ""}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {" "}
          <div className="w-full">
            <TextInput
              type="number"
              id="delivery_fee"
              name="delivery_fee"
              className="py-[13px]"
              errorMessage={
                formErrors.delivery_fee ||
                (error as any)?.data?.errors?.delivery_fee?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.delivery_fee}
              onChange={handleInputChange}
              placeholder="Enter delivery fee"
              title={
                <span className="font-[500]">
                  Delivery Fee <span className="text-red-600">*</span>
                </span>
              }
              required={false}
            />
          </div>
          <div className="w-full">
            <TextInput
              type="number"
              id="estimated_delivery_days"
              name="estimated_delivery_days"
              className="py-[13px]"
              errorMessage={
                formErrors.estimated_delivery_days ||
                (error as any)?.data?.errors?.estimated_delivery_days?.map(
                  (err: any) => err
                ) ||
                ""
              }
              value={formValues.estimated_delivery_days}
              onChange={handleInputChange}
              placeholder="Enter estimated delivery days"
              title={
                <span className="font-[500]">
                  Estimated Delivery Days{" "}
                  <span className="text-red-600">*</span>
                </span>
              }
              required={false}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-300 pt-3">
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
