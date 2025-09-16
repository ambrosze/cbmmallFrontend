import AttributeHeader from "@/components/Attributes/AttributeHeader";
import TableMainComponent from "@/components/Attributes/TableMainComponent";
import Header from "@/components/header";
import PhoneInputWithCountry from "@/components/Input/PhoneInputWithCountry";
import SelectInput from "@/components/Input/SelectInput";
import TextInput from "@/components/Input/TextInput";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import DeleteModal from "@/components/sharedUI/DeleteModal";
import ImageComponent from "@/components/sharedUI/ImageComponent";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useCheckoutPosCartMutation,
  useClearPosCartMutation,
  useCreatePosMutation,
  useDecreasePosCartItemQuantityMutation,
  useIncreasePosCartItemQuantityMutation,
  useRemovePosCartItemMutation,
  useUpdatePosCartItemMutation,
} from "@/services/sales/pos";
import { useGetAllPosSalesCheckoutQuery } from "@/services/sales/sales";
import { PosCartItem } from "@/types/PosTypes";
import { formatCurrency } from "@/utils/fx";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Dropdown, MenuProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";

interface AddItemFormState {
  sku: string;
  quantity: string;
}

interface CustomerFormState {
  customer_name: string;
  customer_phone_number: string;
  customer_email: string;
  payment_method: string;
  discount_code: string;
}

// POS Cart columns for table
const posCartColumns = [
  {
    title: "Item",
    dataIndex: "name",
    key: "name",
    width: 350,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    width: 150,
  },
  {
    title: "Unit Price",
    dataIndex: "price",
    key: "price",
    width: 200,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    width: 200,
  },
  {
    title: "Actions",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 100,
    align: "center" as const,
  },
];

const index = () => {
  const [search, setSearch] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PosCartItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteClearAllModal, setShowDeleteClearAllModal] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const [addItemForm, setAddItemForm] = useState<AddItemFormState>({
    sku: "",
    quantity: "1",
  });
  const skuInputRef = useRef<HTMLInputElement | null>(null);

  // helper to focus & select SKU input
  const focusSku = useCallback(() => {
    if (skuInputRef.current) {
      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        if (skuInputRef.current) {
          skuInputRef.current.focus();
          skuInputRef.current.select?.();
        }
      });
    }
  }, []);

  // initial mount focus & whenever modal closes returning to main form
  useEffect(() => {
    if (
      !showAddItemModal &&
      !showCheckoutModal &&
      !showDeleteModal &&
      !showDeleteClearAllModal
    ) {
      focusSku();
    }
  }, [
    focusSku,
    showAddItemModal,
    showCheckoutModal,
    showDeleteModal,
    showDeleteClearAllModal,
  ]);

  // Global click handler to maintain focus on SKU input
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't refocus if clicking on inputs, buttons, or interactive elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "BUTTON" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest('[role="button"]') ||
        target.closest(".ant-dropdown") ||
        showAddItemModal ||
        showCheckoutModal ||
        showDeleteModal ||
        showDeleteClearAllModal
      ) {
        return;
      }

      // Small delay to allow for other interactions to complete
      setTimeout(() => {
        focusSku();
      }, 100);
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [
    focusSku,
    showAddItemModal,
    showCheckoutModal,
    showDeleteModal,
    showDeleteClearAllModal,
  ]);

  const [customerForm, setCustomerForm] = useState<CustomerFormState>({
    customer_name: "Walk-in Customer",
    customer_phone_number: "",
    customer_email: "",
    payment_method: "POS",
    discount_code: "",
  });

  // POS cart hooks
  const {
    data: posCartData,
    refetch: refetchPosCart,
    isLoading: isLoadingPosCart,
  } = useGetAllPosSalesCheckoutQuery({});
  console.log("🚀 ~ index ~ posCartData:", posCartData);

  const [createPos, { isLoading: isAddingItem }] = useCreatePosMutation();
  const [updateCartItem, { isLoading: isUpdatingQty }] =
    useUpdatePosCartItemMutation();
  const [increaseQty, { isLoading: isIncreasingQty }] =
    useIncreasePosCartItemQuantityMutation();
  const [decreaseQty, { isLoading: isDecreasingQty }] =
    useDecreasePosCartItemQuantityMutation();
  const [removeCartItem, { isLoading: isRemovingCartItem }] =
    useRemovePosCartItemMutation();
  const [clearCart, { isLoading: isClearingCart }] = useClearPosCartMutation();
  const [checkoutCart, { isLoading: isCheckingOut }] =
    useCheckoutPosCartMutation();

  // Handlers
  const handleAddItemSubmit = async () => {
    if (!addItemForm.sku) return;
    try {
      await createPos({
        sku: addItemForm.sku.trim(),
        quantity: Number(addItemForm.quantity) || 1,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Success"
              title="Item Added"
              image={imgSuccess}
              textColor="green"
              message="Cart updated"
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Item added",
      });
      setShowAddItemModal(false);
      setAddItemForm({ sku: "", quantity: "1" });
      refetchPosCart();
      focusSku();
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Error"
              title="Add Failed"
              image={imgError}
              textColor="red"
              message={err?.data?.message || "Could not add item"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Add failed",
      });
    }
  };

  const handleIncrease = async (id: string) => {
    setUpdatingItemId(id);
    try {
      await increaseQty({ cart_item_id: id }).unwrap();
      refetchPosCart();
    } finally {
      setUpdatingItemId(null);
    }
    focusSku();
  };

  const handleDecrease = async (id: string) => {
    setUpdatingItemId(id);
    try {
      await decreaseQty({ cart_item_id: id }).unwrap();
      refetchPosCart();
    } finally {
      setUpdatingItemId(null);
    }
    focusSku();
  };

  // Set quantity directly from input
  const handleSetQuantity = async (id: string, qty: number) => {
    const nextQty = Number.isFinite(qty) && qty >= 1 ? Math.floor(qty) : 1;
    setUpdatingItemId(id);
    try {
      await updateCartItem({
        cart_item_id: id,
        body: { quantity: nextQty },
      }).unwrap();
      refetchPosCart();
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Error"
              title="Update Failed"
              image={imgError}
              textColor="red"
              message={err?.data?.message || "Could not update quantity"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Update failed",
      });
    } finally {
      setUpdatingItemId(null);
    }
    focusSku();
  };

  const handleRemove = async (id: string) => {
    await removeCartItem({ id }).unwrap();
    refetchPosCart();
    focusSku();
  };

  const handleClear = async () => {
    if (!posCartData?.data?.length) return;
    try {
      await clearCart().unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Success"
              title="Cart Cleared"
              image={imgSuccess}
              textColor="green"
              message="All items removed from cart"
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Cart cleared",
      });
      setShowDeleteClearAllModal(false);
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Error"
              title="Clear Failed"
              image={imgError}
              textColor="red"
              message={error?.data?.message || "Could not clear cart"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Clear failed",
      });
    }
    refetchPosCart();
    focusSku();
  };

  const handleCheckout = async () => {
    if (!posCartData?.data?.length) return;
    if (!customerForm.customer_name || !customerForm.payment_method) return;
    try {
      await checkoutCart({
        customer_name: customerForm.customer_name,
        customer_phone_number: customerForm.customer_phone_number,
        payment_method: customerForm.payment_method,
        customer_email: customerForm.customer_email,
        discount_code: customerForm.discount_code || undefined,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Success"
              title="Checkout Complete"
              image={imgSuccess}
              textColor="green"
              message="Sale recorded"
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Checkout done",
      });
      setCustomerForm({
        customer_name: "",
        customer_phone_number: "",
        customer_email: "",
        payment_method: "",
        discount_code: "",
      });
      setShowCheckoutModal(false);
      refetchPosCart();
      focusSku();
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText="Error"
              title="Checkout Failed"
              image={imgError}
              textColor="red"
              message={err?.data?.message || "Could not complete checkout"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Checkout failed",
      });
    }
  };

  // Menu items for cart actions
  const items: MenuProps["items"] = [
    {
      label: (
        <button
          onClick={() => {
            if (!posCartData?.data?.length) {
              showPlannerToast({
                options: {
                  customToast: (
                    <CustomToast
                      altText={"Success"}
                      title={<>Cart is empty</>}
                      image={imgError}
                      textColor="red"
                      message={"Please add to cart"}
                      backgroundColor="#FCFCFD"
                    />
                  ),
                },
                message: "Please check your email for verification.",
              });
              focusSku();
              return;
            }
            setShowCheckoutModal(true);
          }}
          className="flex w-full items-center gap-2"
          type="button"
        >
          <Icon icon="solar:card-outline" width="16" height="16" />
          Checkout Cart
        </button>
      ),
      key: "1",
    },
    {
      label: (
        <button
          onClick={() => {
            if (!posCartData?.data?.length) {
              showPlannerToast({
                options: {
                  customToast: (
                    <CustomToast
                      altText={"Success"}
                      title={<>Cart is empty</>}
                      image={imgError}
                      textColor="red"
                      message={"Please add to cart"}
                      backgroundColor="#FCFCFD"
                    />
                  ),
                },
                message: "Please check your email for verification.",
              });
              focusSku();
              return;
            }
            setShowDeleteClearAllModal(true);
          }}
          className="flex w-full items-center text-red-500 gap-2"
          type="button"
        >
          <Icon icon="solar:trash-bin-trash-outline" width="16" height="16" />
          Clear Cart
        </button>
      ),
      key: "2",
    },
  ];

  // Transform cart data for table
  const transformedCartData = posCartData?.data?.map((item) => ({
    key: item.id,
    name: (
      <div className="flex items-center gap-2">
        <div className="h-[30px] w-[30px]">
          <ImageComponent
            isLoadingImage={isLoadingImage}
            setIsLoadingImage={setIsLoadingImage}
            aspectRatio="1/1"
            src={item?.options?.image_url || "/images/empty_box.svg"}
            width={50}
            height={50}
            alt="image"
            className="h-[40px] w-[40px] rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{item.name}</span>
          <span className="text-xs text-gray-500">
            {item.options?.itemable_type?.split("\\")?.pop?.()}
          </span>
        </div>
      </div>
    ),
    quantity: (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleDecrease(item.id)}
          disabled={updatingItemId === item.id}
          className="w-6 h-6 flex items-center justify-center rounded border text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Decrease quantity"
        >
          {updatingItemId === item.id && isDecreasingQty ? (
            <Icon icon="line-md:loading-loop" width="14" height="14" />
          ) : (
            "-"
          )}
        </button>
        <input
          key={`${item.id}-${item.quantity}`}
          type="number"
          min={1}
          defaultValue={item.quantity}
          disabled={updatingItemId === item.id || isUpdatingQty}
          aria-label="Set quantity"
          title="Set quantity"
          placeholder="Qty"
          onBlur={(e) => {
            const raw = e.currentTarget.value;
            const parsed = parseInt(raw, 10);
            if (!Number.isFinite(parsed)) {
              // reset visual value back to current item quantity
              e.currentTarget.value = String(item.quantity);
              return;
            }
            if (parsed !== item.quantity) {
              handleSetQuantity(item.id, parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              // revert value
              (e.currentTarget as HTMLInputElement).value = String(
                item.quantity
              );
              e.currentTarget.blur();
            }
          }}
          className="w-14 text-center border rounded px-1 py-0.5 disabled:opacity-50"
        />
        <button
          onClick={() => handleIncrease(item.id)}
          disabled={updatingItemId === item.id}
          className="w-6 h-6 flex items-center justify-center rounded border text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Increase quantity"
        >
          {updatingItemId === item.id && isIncreasingQty ? (
            <Icon icon="line-md:loading-loop" width="14" height="14" />
          ) : (
            "+"
          )}
        </button>
      </div>
    ),
    price: (
      <span className="font-medium">{formatCurrency(item.price || 0)}</span>
    ),
    total: (
      <span className="font-semibold">{formatCurrency(item.total || 0)}</span>
    ),
    action: (
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            setShowDeleteModal(true);
            setSelectedItem(item);
          }}
          className="text-red-500 hover:text-red-700 disabled:opacity-50"
          title="Remove item from cart"
        >
          <Icon icon="solar:trash-bin-trash-outline" width="18" height="18" />
        </button>
      </div>
    ),
  }));

  return (
    <div className="">
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search by SKU or item name"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />

      <AttributeHeader
        headerText="POS Cart Management"
        btnText="Add Item"
        showAddButton={false}
        onClick={() => setShowAddItemModal(true)}
      />

      <SharedLayout className="bg-white">
        {isLoadingPosCart ? (
          <SkeletonLoaderForPage />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 ">
            <form className="space-y-4 py-2 lg:w-[30%] w-full">
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <TextInput
                  name="sku"
                  type="text"
                  value={addItemForm.sku}
                  onChange={(e) =>
                    setAddItemForm((p) => ({ ...p, sku: e.target.value }))
                  }
                  placeholder="Enter product SKU"
                  autoFocus
                  maintainFocus
                  ref={skuInputRef}
                  className="w-full border rounded px-3 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <TextInput
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={addItemForm.quantity}
                  onChange={(e) =>
                    setAddItemForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-3 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setAddItemForm({ sku: "", quantity: "1" });
                    focusSku();
                  }}
                  type="button"
                  className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
                >
                  Clear
                </button>

                <button
                  disabled={isAddingItem || !addItemForm.sku}
                  onClick={handleAddItemSubmit}
                  className="px-4 py-2 text-sm rounded bg-primary-40 text-white disabled:opacity-50 w-full hover:opacity-90"
                >
                  {isAddingItem ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </form>
            <div className="lg:w-[70%] w-full">
              <TableMainComponent
                DeleteModalText={<>{selectedItem?.name}</>}
                data={selectedItem}
                deleteCardApi={removeCartItem}
                isDeleteLoading={isClearingCart || isRemovingCartItem}
                showDeleteModal={showDeleteModal}
                refetch={refetchPosCart}
                formValues={{}}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={false}
                printTitle="POS Cart"
                showExportButton={false}
                showPrintButton={false}
                columnsTable={posCartColumns as any}
                transformedData={transformedCartData || []}
              />

              {/* Cart Summary */}
              <div className="flex md:flex-row flex-col justify-between items-center mt-4 p-4 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Items: {posCartData?.data?.length || 0}
                  </span>
                  <div className="md:flex gap-3 hidden">
                    <CustomButton
                      onClick={() => {
                        if (!posCartData?.data?.length) {
                          showPlannerToast({
                            options: {
                              customToast: (
                                <CustomToast
                                  altText={"Success"}
                                  title={<>Cart is empty</>}
                                  image={imgError}
                                  textColor="red"
                                  message={"Please add to cart"}
                                  backgroundColor="#FCFCFD"
                                />
                              ),
                            },
                            message:
                              "Please check your email for verification.",
                          });
                          focusSku();
                          return;
                        }
                        setShowCheckoutModal(true);
                      }}
                      className="flex w-full bg-primary-40  items-center justify-center px-5 gap-2 text-white"
                      type="button"
                    >
                      <Icon
                        icon="solar:card-outline"
                        width="26"
                        height="26"
                        className="w-[40px]"
                      />
                      Checkout Cart
                    </CustomButton>
                    <CustomButton
                      onClick={() => {
                        if (!posCartData?.data?.length) {
                          showPlannerToast({
                            options: {
                              customToast: (
                                <CustomToast
                                  altText={"Success"}
                                  title={<>Cart is empty</>}
                                  image={imgError}
                                  textColor="red"
                                  message={"Please add to cart"}
                                  backgroundColor="#FCFCFD"
                                />
                              ),
                            },
                            message:
                              "Please check your email for verification.",
                          });
                          focusSku();
                          return;
                        }
                        setShowDeleteClearAllModal(true);
                      }}
                      className="flex w-full items-center justify-center text-white bg-red-500 px-5 gap-2"
                      type="button"
                    >
                      <Icon
                        icon="solar:trash-bin-trash-outline"
                        width="16"
                        height="16"
                      />
                      Clear Cart
                    </CustomButton>
                  </div>
                  <Dropdown
                    menu={{ items }}
                    className="md:hidden block"
                    trigger={["click"]}
                  >
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                      <Icon
                        icon="solar:menu-dots-outline"
                        width="16"
                        height="16"
                      />
                      Actions
                    </button>
                  </Dropdown>
                </div>
                <div className="text-lg font-semibold">
                  Sub Total: {formatCurrency(posCartData?.sub_total || 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </SharedLayout>
      {showDeleteClearAllModal && (
        <>
          <PlannerModal
            modalOpen={showDeleteClearAllModal}
            setModalOpen={setShowDeleteClearAllModal}
            onCloseModal={() => setShowDeleteClearAllModal(false)}
          >
            <DeleteModal
              handleDelete={() => {
                handleClear();
              }}
              isLoading={isClearingCart}
              onCloseModal={() => setShowDeleteClearAllModal(false)}
              title={
                <>
                  Are you sure you want to{" "}
                  <span className="font-bold">clear all cart</span>
                </>
              }
              text="Are you sure you want to cancel?"
              altText=""
            />
          </PlannerModal>
        </>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <PlannerModal
          modalOpen={showAddItemModal}
          setModalOpen={setShowAddItemModal}
          title="Add Item to Cart"
          width={420}
          onCloseModal={() => setShowAddItemModal(false)}
        >
          <form className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <TextInput
                name="sku"
                type="text"
                value={addItemForm.sku}
                onChange={(e) =>
                  setAddItemForm((p) => ({ ...p, sku: e.target.value }))
                }
                placeholder="Enter product SKU"
                className="w-full border rounded px-3 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <TextInput
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={addItemForm.quantity}
                onChange={(e) =>
                  setAddItemForm((p) => ({ ...p, quantity: e.target.value }))
                }
                className="w-full border rounded px-3 py-3 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={isAddingItem || !addItemForm.sku}
                onClick={handleAddItemSubmit}
                className="px-4 py-2 text-sm rounded bg-primary-40 text-white disabled:opacity-50 hover:opacity-90"
              >
                {isAddingItem ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </form>
        </PlannerModal>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <PlannerModal
          modalOpen={showCheckoutModal}
          setModalOpen={setShowCheckoutModal}
          title="Checkout"
          width={500}
          onCloseModal={() => setShowCheckoutModal(false)}
        >
          <form className="space-y-4 py-2">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600 mb-1">Cart Summary</div>
              <div className="font-semibold">
                Total: {formatCurrency(posCartData?.sub_total || 0)}
              </div>
              <div className="text-xs text-gray-500">
                {posCartData?.data?.length || 0} item
                {posCartData?.data?.length === 1 ? "" : "s"} •{" "}
                {posCartData?.data?.reduce(
                  (total, item) => total + item.quantity,
                  0
                ) || 0}{" "}
                pieces
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name *</label>
                <TextInput
                  name="customer_name"
                  type="text"
                  value={customerForm.customer_name}
                  onChange={(e) =>
                    setCustomerForm((p) => ({
                      ...p,
                      customer_name: e.target.value,
                    }))
                  }
                  placeholder="Enter customer name"
                  className="w-full border rounded px-3 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <PhoneInputWithCountry
                  disabled={false}
                  value={customerForm.customer_phone_number}
                  onChange={(e) =>
                    setCustomerForm((p) => ({
                      ...p,
                      phone_number: e,
                    }))
                  }
                  placeholder="Enter phone number"
                  className="w-full border rounded  text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <TextInput
                  name="customer_email"
                  type="email"
                  value={customerForm.customer_email}
                  onChange={(e) =>
                    setCustomerForm((p) => ({
                      ...p,
                      customer_email: e.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                  className="w-full border rounded px-3 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method *</label>
                <SelectInput
                  onChange={(value) =>
                    setCustomerForm((p) => ({
                      ...p,
                      payment_method: value,
                    }))
                  }
                  className="py-[3px]"
                  value={customerForm.payment_method || undefined}
                  placeholder={
                    <span className="text-sm">Select payment method</span>
                  }
                  data={[
                    { value: "Cash", label: "Cash" },
                    { value: "POS", label: "POS" },
                    { value: "Transfer", label: "Transfer" },
                    { value: "Cheque", label: "Cheque" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Code</label>
                <TextInput
                  name="discount_code"
                  type="text"
                  value={customerForm.discount_code}
                  onChange={(e) =>
                    setCustomerForm((p) => ({
                      ...p,
                      discount_code: e.target.value,
                    }))
                  }
                  placeholder="Enter discount code"
                  className="w-full border rounded px-3 py-3 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={
                  isCheckingOut ||
                  !posCartData?.data?.length ||
                  !customerForm.customer_name ||
                  !customerForm.payment_method
                }
                onClick={handleCheckout}
                className="px-6 py-2 text-sm rounded bg-primary-40 text-white disabled:opacity-50 hover:opacity-90"
              >
                {isCheckingOut ? "Processing..." : "Complete Sale"}
              </button>
            </div>
          </form>
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
