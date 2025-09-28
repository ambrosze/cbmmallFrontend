import Header from "@/components/header";
import InvoiceReceipt from "@/components/Invoice/InvoiceReceipt";
import SkeletonLoaderForPage from "@/components/sharedUI/Loader/SkeletonLoaderForPage";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { useGetSingleSalesQuery } from "@/services/sales/sales";
import { formatCurrency, newUserTimeZoneFormatDate } from "@/utils/fx";
import { Breadcrumb } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
const SalesDetail = () => {
  const [search, setSearch] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const router = useRouter();

  const { data, isLoading, error } = useGetSingleSalesQuery({
    id: router.query.id as string,
    include:
      "saleInventories.inventory.productVariant.product,saleInventories.inventory.store,discount,cashier.user,buyerable",
  });

  const saleData = data?.data as any; // Using any to handle extended API response

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          search={search}
          setSearch={setSearch}
          showSearch={false}
          placeHolderText=""
          handleOpenSideNavBar={() => {}}
          isOpenSideNavBar
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Sale
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't load the sales details. Please try again.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={true}
        placeHolderText="Search sales, products, customers..."
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <SharedLayout className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
          {isLoading ? (
            <SkeletonLoaderForPage />
          ) : (
            <div className="space-y-8">
              <Breadcrumb
                className=""
                items={[
                  { title: "Back", href: "/sales/sales-list" },
                  {
                    title: (
                      <span className="font-semibold">{"Sale Details"}</span>
                    ),
                  },
                ]}
              />
              {/* Header Section with Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Sale Details
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {saleData?.created_at
                          ? newUserTimeZoneFormatDate(
                              saleData.created_at,
                              "MMMM DD, YYYY • HH:mm"
                            )
                          : "Date not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <button
                      onClick={() => setShowInvoice(true)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Invoice Number
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        #{saleData?.invoice_number}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {saleData?.total_price
                          ? formatCurrency(saleData.total_price)
                          : "₦0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Payment Method
                      </p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        {saleData?.payment_method || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Items Sold
                      </p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        {saleData?.sale_inventories?.reduce(
                          (sum: number, item: any) =>
                            sum + (item?.quantity || 0),
                          0
                        ) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className=" gap-8">
                {/* Left Column - Sale Items & Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sale Items */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Sale Items
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Products purchased in this transaction
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Batch
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {saleData?.sale_inventories?.map(
                              (item: any, index: number) => (
                                <tr
                                  key={item.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {item?.inventory?.product_variant?.name?.charAt(
                                          0
                                        ) || "P"}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {item?.inventory?.product_variant
                                            ?.name || "Unknown Product"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item?.inventory?.product_variant?.sku ||
                                      "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item?.inventory?.batch_number || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                    {formatCurrency(item?.price)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 text-right">
                                    {item?.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
                                    {formatCurrency(item?.total_price)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Transaction Details
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Sale Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Channel:</span>
                              <span className="font-medium uppercase">
                                {saleData?.channel}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Payment Method:
                              </span>
                              <span className="font-medium">
                                {saleData?.payment_method}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Barcode
                          </h4>
                          {saleData?.barcode ? (
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <Image
                                src={saleData.barcode}
                                alt="Sale Barcode"
                                width={180}
                                height={40}
                                className="mx-auto"
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                              No barcode available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                {/* Right Column - Summary & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Financial Summary
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            {saleData?.subtotal_price
                              ? formatCurrency(saleData.subtotal_price)
                              : "₦0.00"}
                          </span>
                        </div>
                        {saleData?.metadata?.discount && (
                          <div className="flex justify-between text-green-600">
                            <span>
                              Discount (
                              {saleData?.metadata?.discount?.percentage}%):
                            </span>
                            <span className="font-semibold">
                              -
                              {formatCurrency(
                                saleData?.subtotal_price &&
                                  saleData?.metadata?.discount?.percentage
                                  ? (parseFloat(saleData.subtotal_price) *
                                      parseFloat(
                                        saleData.metadata.discount.percentage
                                      )) /
                                      100
                                  : 0
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-semibold text-gray-900">
                            {saleData?.tax
                              ? formatCurrency(saleData.tax)
                              : "₦0.00"}
                          </span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-gray-900">
                            Total:
                          </span>
                          <span className="font-bold text-green-600">
                            {saleData?.total_price
                              ? formatCurrency(saleData.total_price)
                              : "₦0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Customer
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {saleData?.buyerable?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {saleData?.buyerable?.name || "Unknown Customer"}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {saleData?.buyerable?.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="text-gray-900">
                            {saleData?.buyerable?.phone_number || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="text-gray-900">
                            {saleData?.buyerable?.address || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store & Staff Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Store & Staff
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Store
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-semibold text-gray-900">
                              {saleData?.sale_inventories?.[0]?.inventory?.store
                                ?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {saleData?.sale_inventories?.[0]?.inventory?.store
                                ?.address || "No address"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Cashier
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-semibold text-gray-900">
                              {saleData?.cashier?.user?.first_name}{" "}
                              {saleData?.cashier?.user?.last_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Staff #: {saleData?.cashier?.staff_no || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount Information */}
                  {saleData?.metadata?.discount && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="p-6 border-b border-green-200">
                        <h3 className="text-xl font-semibold text-green-800">
                          Discount Applied
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Code:</span>
                            <span className="font-mono font-semibold text-green-800">
                              {saleData?.metadata?.discount?.code}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700">Discount:</span>
                            <span className="font-semibold text-green-800">
                              {saleData?.metadata?.discount?.percentage}%
                            </span>
                          </div>
                          <p className="text-sm text-green-700">
                            {saleData?.metadata?.discount?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SharedLayout>
      {showInvoice && (
        <PlannerModal
          modalOpen={showInvoice}
          setModalOpen={setShowInvoice}
          className=""
          width={400}
          title="Invoice"
          onCloseModal={() => setShowInvoice(false)}
        >
          <InvoiceReceipt selectedItem={data?.data as any} />
        </PlannerModal>
      )}
    </div>
  );
};

export default SalesDetail;
