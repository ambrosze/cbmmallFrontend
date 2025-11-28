const OrderSkeletonLoader = () => {
  return (
    <div className="order-details-container">
      {/* Header Section Skeleton */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-36 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Customer & Delivery Info Skeleton */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Customer Information Skeleton */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-14 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Delivery Address Skeleton */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="h-8 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="h-3 bg-gray-200 rounded w-10 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Summary Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Information Skeleton */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-3">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="h-8 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-7 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge Skeleton */}
      <div className="mt-6 pt-6 border-t flex justify-between items-center">
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeletonLoader;
