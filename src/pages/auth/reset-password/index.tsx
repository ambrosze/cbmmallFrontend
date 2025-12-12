import TextInput from "@/components/Input/TextInput";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useForgetPasswordMutation } from "@/services/auth";
import { forgetPasswordSchema } from "@/validation/authValidate";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import { AuthHeader } from "../login";
const imgError = "/states/notificationToasts/error.svg";

interface IAuthHeader {
  icon: string;
  headerText: string;
}
interface IProps {}

const index = ({}: IProps) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [forgetPassword, { isLoading, isError, error }] =
    useForgetPasswordMutation();
  const [formValues, setFormValues] = useState({
    email: "",
  });
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await forgetPasswordSchema.validate(formValues, { abortEarly: false });

      // Clear previous form errors if validation is successful
      setFormErrors({});

      // Proceed with server-side submission
      const response = await forgetPassword({
        email: formValues.email,
      }).unwrap();
      router.push("/auth/verify-reset-password?email=" + formValues.email);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Handle client-side validation errors
        const errors: { [key: string]: string } = {};
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message;
          }
        });
        setFormErrors(errors);
      } else {
        // Handle server-side errors
        console.log("🚀 ~ handleSubmit ~ err:", err);
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={"Error"}
                title={"Login Failed"}
                image={imgError}
                textColor="red"
                message={(err as any)?.data?.message || "Invalid Credentials"}
                backgroundColor="#FCFCFD"
              />
            ),
          },
          message: "Invalid Credentials",
        });
      }
    }
  };
  return (
    <div>
      <div className="md:w-[448px] w-full mt-5 m-auto shadow-f2 py-3 px-5 rounded-lg bg-white/80 ">
        <AuthHeader headerText="Enter the email to reset Password" />

        <div className="mt-10">
          <form className="flex flex-col gap-4">
            <TextInput
              placeholder="you@email.com"
              errorMessage={
                formErrors.email ||
                (error as any)?.data?.errors?.email?.map((err: any) => err) ||
                ""
              }
              name="email"
              className=""
              onChange={handleInputChange}
              type="text"
              title="Email"
            />

            <div className="mt-5">
              <CustomButton
                onClick={() => {
                  handleSubmit();
                }}
                className="bg-primary-40 text-white"
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <Spinner className="border-white" />
                ) : (
                  "Get Started"
                )}
              </CustomButton>
            </div>
            <Link href="/auth/login" className="text-center hover:opacity-60">
              Go Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
