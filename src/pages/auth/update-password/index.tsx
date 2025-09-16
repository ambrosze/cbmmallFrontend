import TextInput from "@/components/Input/TextInput";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import PlannerModal from "@/components/sharedUI/PlannerModal";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useResetPasswordMutation } from "@/services/auth";
import { resetPasswordSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
import { AuthHeader } from "../login";
import Link from "next/link";

interface IInputHeader {
  icon: string;
  headerText: string;
}
interface IProps {}
const validationSteps = [
  "Characters",
  "Uppercase",
  "Lowercase",
  "Number",
  "Special Character",
];
const index = ({}: IProps) => {
  const router = useRouter();
  console.log("🚀 ~ index ~ router:", router?.query?.token);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [resetPassword, { isLoading, isSuccess, error }] =
    useResetPasswordMutation();

  const [formValues, setFormValues] = useState({
    token: router?.query?.token || "", // this is a placeholder real token will be added
    password: "",
    password_confirmation: "",
  });
  const [activeValidationSteps, setActiveValidationSteps] = useState<string[]>(
    []
  );
  const [
    activeValidationConfirmPasswordSteps,
    setActiveValidationConfirmPasswordSteps,
  ] = useState<string[]>([]);

  useEffect(() => {
    setFormValues({
      token: router?.query?.token || "",
      password: formValues.password,
      password_confirmation: formValues.password_confirmation,
    });
  }, [router?.query?.token]);

  const validatePasswordStrength = (
    password: string,
    isConfirmation: boolean = false
  ) => {
    const steps = [];

    if (password.length >= 8) steps.push("Characters");
    if (/[A-Z]/.test(password)) steps.push("Uppercase");
    if (/[a-z]/.test(password)) steps.push("Lowercase");
    if (/\d/.test(password)) steps.push("Number");
    if (/[\W_]/.test(password)) steps.push("Special Character");

    if (isConfirmation) {
      setActiveValidationConfirmPasswordSteps(steps);
    } else {
      setActiveValidationSteps(steps);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePasswordStrength(value);
    }
    if (name === "password_confirmation") {
      validatePasswordStrength(value, true);
    }
  };
  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await resetPasswordSchema.validate(formValues, { abortEarly: false });

      // Clear previous form errors if validation is successful
      setFormErrors({});

      // Proceed with server-side submission
      const response = await resetPassword({
        token: formValues.token.toString(),
        password: formValues.password,
        password_confirmation: formValues.password_confirmation,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={"Password Updated Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Thank you!!"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });
      setIsShowModal(true);
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
        <AuthHeader headerText="Let’s quickly your personal account!" />
        <div className="mt-5">
          <form className="flex flex-col gap-4">
            <div className="relative">
              <TextInput
                placeholder="Enter password (min. of 8 characters)"
                errorMessage={
                  formErrors.password ||
                  (error as any)?.data?.errors?.password?.map(
                    (err: any) => err
                  ) ||
                  ""
                }
                name="password"
                className=""
                onChange={handleInputChange}
                type={!showPassword ? "password" : "text"}
                title="Password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[40px] border-l-2 pl-2"
              >
                <Icon
                  icon={showPassword ? "solar:eye-outline" : "proicons:eye-off"}
                  className="text-[20px] "
                />
              </div>
              <div className="flex gap-x-3 gap-y-1 flex-wrap mt-2">
                {validationSteps.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`py-2 px-3 ${
                      activeValidationSteps.includes(item)
                        ? "bg-primary-40 text-white"
                        : "bg-[#ECEFF1]"
                    } rounded-full text-sm flex items-center gap-2`}
                  >
                    {item}{" "}
                    <Icon
                      icon={
                        activeValidationSteps.includes(item)
                          ? "ion:checkmark-done"
                          : "ion:close"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <TextInput
                placeholder="Enter password (min. of 8 characters)"
                errorMessage={
                  formErrors.password_confirmation ||
                  (error as any)?.data?.errors?.password_confirmation?.map(
                    (err: any) => err
                  ) ||
                  ""
                }
                name="password_confirmation"
                className=""
                onChange={handleInputChange}
                type={!showPassword ? "password" : "text"}
                title="Confirm Password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[40px] border-l-2 pl-2"
              >
                <Icon
                  icon={showPassword ? "solar:eye-outline" : "proicons:eye-off"}
                  className="text-[20px] "
                />
              </div>
              <div className="flex gap-x-3 gap-y-1 flex-wrap mt-2">
                {validationSteps.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`py-2 px-3 ${
                      activeValidationConfirmPasswordSteps.includes(item)
                        ? "bg-primary-40 text-white"
                        : "bg-[#ECEFF1]"
                    } rounded-full text-sm flex items-center gap-2`}
                  >
                    {item}{" "}
                    <Icon
                      icon={
                        activeValidationConfirmPasswordSteps.includes(item)
                          ? "ion:checkmark-done"
                          : "ion:close"
                      }
                    />
                  </button>
                ))}
              </div>
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
                  "Update Password"
                )}
              </CustomButton>
            </div>
            <Link href="/auth/reset-password" className="text-center hover:opacity-60">
              Go Back
            </Link>
          </form>
        </div>
      </div>
      {isShowModal && (
        <PlannerModal
          modalOpen={isShowModal}
          setModalOpen={setIsShowModal}
          onCloseModal={() => {
            router.push("/auth/login");
            setIsShowModal(false);
          }}
          width={448}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Icon
              icon="ri:checkbox-circle-fill"
              className="text-[#18BB23] text-[80px]"
            />
            <h3 className="text-[#2C3137] font-bold text-center text-[30px]">
              Password Updated !
            </h3>
            <p className="text-[#586283] text-center">
              Your account has been created. Don’t share with anyone to ensure
              your account is safe and secure.
            </p>
            <CustomButton
              onClick={() => {
                router.push("/auth/login");
              }}
              disabled={false}
              className="bg-primary-40 text-white"
            >
              Sign In
            </CustomButton>
          </div>
        </PlannerModal>
      )}
    </div>
  );
};

export default index;
