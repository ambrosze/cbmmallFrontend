import TextInput from "@/components/Input/TextInput";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import {
  useForgetPasswordMutation,
  useVerifyPasswordResetTokenMutation,
} from "@/services/auth";
import { verifyPasswordResetTokenSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import { AuthHeader } from "../login";
import imgError from "/public/states/notificationToasts/error.svg";
import Link from "next/link";

interface IAuthHeader {
  icon: string;
  headerText: string;
}
interface IProps {}

const index = ({}: IProps) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [forgetPassword, { isLoading: isLoadingForgetPassword }] =
    useForgetPasswordMutation();
  const [verifyPasswordResetToken, { isLoading, isError, error }] =
    useVerifyPasswordResetTokenMutation();
  const [formValues, setFormValues] = useState({
    token: "",
  });
  const router = useRouter();
  console.log("🚀 ~ index ~ router:", router?.query?.email);
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
      await verifyPasswordResetTokenSchema.validate(formValues, {
        abortEarly: false,
      });

      // Clear previous form errors if validation is successful
      setFormErrors({});

      // Proceed with server-side submission
      const response = await verifyPasswordResetToken({
        token: formValues.token,
      }).unwrap();
      router.push("/auth/update-password?token=" + formValues.token);
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
  const handleSubmitResetPassword = async () => {
    try {
      const response = await forgetPassword({
        email: router?.query?.email as any,
      }).unwrap();
    } catch (err: any) {
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
  };
  return (
    <div>
      <div className="md:w-[448px] w-full mt-5 m-auto shadow-f2 py-3 px-5 rounded-lg bg-white/80 ">
        <AuthHeader headerText="Check email to see your password" />

        <div className="mt-5">
          <form className="flex flex-col gap-4">
            <TextInput
              placeholder=""
              maxLength={6}
              errorMessage={
                formErrors.token ||
                (error as any)?.data?.errors?.token?.map((err: any) => err) ||
                ""
              }
              name="token"
              className=""
              onChange={handleInputChange}
              type="text"
              title="Enter Code"
            />

            <div className="flex justify-between items-center">
              <p className="text-[#2C3137]">Didn’t recieve code?</p>
              <button
                type="button"
                disabled={isLoadingForgetPassword}
                onClick={() => {
                  handleSubmitResetPassword();
                }}
                className="py-2 px-3 bg-[#ECEFF1] rounded-full text-sm flex items-center gap-2"
              >
                Resend Code{" "}
                {isLoadingForgetPassword ? (
                  <Spinner className="border-black" />
                ) : (
                  <Icon icon="flowbite:refresh-outline" />
                )}
              </button>
            </div>
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
                  "Verify Email"
                )}
              </CustomButton>
            </div>
            <Link href="/auth/reset-password" className="text-center hover:opacity-60">
              Go Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
