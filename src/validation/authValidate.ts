import * as yup from "yup";
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters")
    .required("Password is required"),
});
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});
export const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});
export const verifyPasswordResetTokenSchema = yup.object().shape({
  token: yup.string().required("Token is required"),
});
export const categorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

// For creating a category, image must be provided
export const categoryCreateSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  image: yup
    .mixed()
    .test(
      "required",
      "Image is required",
      (value) => value !== null && value !== undefined && value !== ""
    ),
});
export const attributeValueSchema = yup.object().shape({
  value: yup.string().required("Value is required"),
});
export const dailyGoldSchema = yup.object().shape({
  category_id: yup.string().required("Category is required"),
  price_per_gram: yup
    .number()
    .required("Price per gram is required")
    .typeError("Price per gram must be a number"),
});
export const adminDiscountSchema = yup.object().shape({
  code: yup.string().required("Code is required"),
  description: yup.string().required("Description is required"),
  percentage: yup
    .number()
    .required("Percentage is required")
    .typeError("Percentage must be a number"),
  is_active: yup.number().required("Status is required"),
});
export const staffSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  store_id: yup.string().required("Store ID is required"),
});
export const storeSchema = yup.object().shape({
  name: yup.string().required("First Name is required"),
  email: yup
    .string()
    .email("Invalid email address"),
  is_warehouse: yup.number().required("Last Name is required"),
});

export const adminItemsSchema = yup.object().shape({
  material: yup
    .string()
    .required("Material is required")
    .oneOf(["Gold", "Diamond"], "Material must be either Gold or Diamond"),

  category_id: yup.string().when("material", {
    is: "Gold",
    then: (schema) => schema.required("Category ID is required for Gold items"),
  }),

  colour_id: yup.string().when("material", {
    is: "Gold",
    then: (schema) => schema.required("Colour ID is required for Gold items"),
  }),

  type_id: yup.string().when("material", {
    is: "Diamond",
    then: (schema) => schema.required("Type ID is required for Diamond items"),
  }),

  weight: yup.string().when("material", {
    is: "Gold",
    then: (schema) => schema.required("Weight is required for Gold items"),
  }),

  price: yup.mixed().when("material", {
    is: "Diamond",
    then: () =>
      yup
        .number()
        .required("Price is required for Diamond items")
        .typeError("Price must be a number"),
    otherwise: () =>
      yup
        .mixed()
        .transform((value) => {
          // Convert empty string to null, otherwise try to parse as number
          if (value === "" || value === undefined) return null;
          const number = Number(value);
          return isNaN(number) ? value : number; // Return original value if NaN
        })
        .nullable()
        .typeError("Price must be a number if provided"),
  }),

  quantity: yup.number().integer("Quantity must be an integer").default(1),

  sku: yup.string().nullable().max(191, "SKU must not exceed 191 characters"),
  // Note: uniqueness check would typically be handled server-side
});
