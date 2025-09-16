import { SinglePosTopLevel } from "@/types/PosTypes";
import { api } from "..";

interface CreatePosType {
  sku: string;
  quantity: number; // integer|min:1|default:1
}
interface AddItemToPosType {
  sku: string; // ensure sku present when adding new item to cart
  quantity?: number; // optional on increase/decrease endpoints
  price?: number; // nullable|numeric|min:0 (for update route)
}
interface UpdateCartItemPayload {
  quantity?: number; // nullable|integer|min:1|default:1
  price?: number; // nullable|numeric|min:0
}
interface CheckoutPayload {
  discount_code?: string; // nullable
  customer_name: string;
  customer_phone_number: string;
  payment_method: string; // Cash, POS, Transfer, etc.
  customer_email?: string;
}
export const posApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSinglePos: builder.query<
      SinglePosTopLevel,
      {
        id: string;
        include?: string;
      }
    >({
      query: ({
        id,
        include,
      }: {
        id: string;
        include?: string; //cryptoNetwork
      }) => {
        const params: any = {};

        if (include) params.include = include;
        return {
          url: `pos/${id}`,
          method: "GET",
          providesTags: ["pos"],
        } as const;
      },
    }),
    // Add item to cart (expects sku & quantity)
    createPos: builder.mutation<any, CreatePosType>({
      query: (body) => ({
        url: "pos/cart-items",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Update existing cart item (quantity / price)
    updatePosCartItem: builder.mutation<
      any,
      { cart_item_id: string; body: UpdateCartItemPayload }
    >({
      query: ({ cart_item_id, body }) => ({
        url: `pos/cart-items/${cart_item_id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Increase quantity (optional quantity defaults to 1)
    increasePosCartItemQuantity: builder.mutation<
      any,
      { cart_item_id: string; quantity?: number }
    >({
      query: ({ cart_item_id, quantity }) => ({
        url: `pos/cart-items/${cart_item_id}/increase-quantity`,
        method: "POST",
        body: quantity ? { quantity } : undefined,
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Decrease quantity (optional quantity defaults to 1)
    decreasePosCartItemQuantity: builder.mutation<
      any,
      { cart_item_id: string; quantity?: number }
    >({
      query: ({ cart_item_id, quantity }) => ({
        url: `pos/cart-items/${cart_item_id}/decrease-quantity`,
        method: "POST",
        body: quantity ? { quantity } : undefined,
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Remove single cart item
    removePosCartItem: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `pos/cart-items/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Clear all items in cart
    clearPosCart: builder.mutation<any, void>({
      query: () => ({
        url: `pos/cart-items`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Checkout cart
    checkoutPosCart: builder.mutation<any, CheckoutPayload>({
      query: (body) => ({
        url: `pos/checkout`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    // Deprecated legacy endpoints kept for compatibility (could be removed later)
    addItemToPosCart: builder.mutation<
      any,
      { id: string; body: AddItemToPosType }
    >({
      query: ({ id, body }) => ({
        url: `pos/cart-items/${id}`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        invalidatesTags: ["pos"],
      }),
    }),
    updatePos: builder.mutation<any, { id: string; body: CreatePosType }>({
      query: ({ id, body }) => ({
        url: `pos/${id}`,
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["pos"],
      }),
    }),
    deletePos: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `pos/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["pos"],
      }),
    }),
    removeItemsFromPos: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `pos/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        invalidatesTags: ["pos"],
      }),
    }),
  }),
});

export const {
  useGetSinglePosQuery,
  useCreatePosMutation,
  useUpdatePosMutation,
  useDeletePosMutation,
  useAddItemToPosCartMutation, // legacy naming due to endpoint
  useRemoveItemsFromPosMutation,
  useUpdatePosCartItemMutation,
  useIncreasePosCartItemQuantityMutation,
  useDecreasePosCartItemQuantityMutation,
  useRemovePosCartItemMutation,
  useClearPosCartMutation,
  useCheckoutPosCartMutation,
} = posApi;
