import TextInput from "@/components/Input/TextInput";
import CustomButton from "@/components/sharedUI/Buttons/Button";
import Spinner from "@/components/sharedUI/Spinner";
import CustomToast from "@/components/sharedUI/Toast/CustomToast";
import { showPlannerToast } from "@/components/sharedUI/Toast/plannerToast";
import { useLoginMutation } from "@/services/auth";
import { UserResponseTopLevel } from "@/types/loginInUserType";
import { loginSchema } from "@/validation/authValidate";
import { Icon } from "@iconify/react";
import { Checkbox } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import * as yup from "yup";
const Logo = "/images/logo-cbm.png";
const imgError = "/states/notificationToasts/error.svg";
const imgSuccess = "/states/notificationToasts/successcheck.svg";

interface IAuthHeader {
  headerText: string;
  color?: string;
}

export const AuthHeader = ({ headerText, color = "#1855BB" }: IAuthHeader) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={Logo}
        alt={"logo"}
        width={40}
        height={40}
        className="w-[223px] h-[60px] object-contain"
      />
      <h3 className="text-[#2C3137] font-medium text-[20px]">{headerText}</h3>
    </div>
  );
};

const index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberCheck, setRememberCheck] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    remember_me: rememberCheck ? 1 : 0,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();
  const router = useRouter();
  const [loginResponse, setLoginResponse] =
    useLocalStorage<UserResponseTopLevel | null>("authLoginResponse", null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormValues({
      email: formValues.email,
      password: formValues.password,
      remember_me: rememberCheck ? 1 : 0,
    });
  }, [rememberCheck]);

  useEffect(() => {
    const storedAuth =
      localStorage.getItem("authLoginResponse") ||
      sessionStorage.getItem("authLoginResponse");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      router.push("/dashboard");
    }
  }, []);

  const handleSubmit = async () => {
    try {
      // Validate form values using yup
      await loginSchema.validate(formValues, { abortEarly: false });

      // Clear previous form errors if validation is successful
      setFormErrors({});

      // Proceed with server-side submission
      const response = await login({
        email: formValues.email,
        password: formValues.password,
        remember_me: rememberCheck ? 1 : 0,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={"Login Successfully"}
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });

      if (response.status.toLowerCase() === "success") {
        setLoginResponse(response);
        if (rememberCheck) {
          setLoginResponse(response);
        } else {
          sessionStorage.setItem("authLoginResponse", JSON.stringify(response));
        }
        router.push("/dashboard");
      }
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
    <div className="">
      <div className="md:w-[448px] w-full mt-5 m-auto shadow-f2 py-3 px-5 rounded-lg bg-white/80 ">
        <AuthHeader headerText="Admin Login" />
        <div className="mt-5">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <TextInput
              placeholder="you@email.com"
              errorMessage={
                formErrors.email ||
                (error as any)?.data?.errors?.email?.map((err: any) => err) ||
                ""
              }
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              type="text"
              title="Email"
            />
            <div className="relative">
              <TextInput
                placeholder="What’s your password?"
                errorMessage={
                  formErrors.password ||
                  (error as any)?.data?.errors?.password?.map(
                    (err: any) => err
                  ) ||
                  ""
                }
                name="password"
                value={formValues.password}
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
                  className="text-[20px]"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Checkbox onChange={(e) => setRememberCheck(e.target.checked)}>
                <span className="text-[#2C3137]"> Remember Me</span>
              </Checkbox>
              <Link href={"/auth/reset-password"} className="text-[#2C3137]">
                Forgot Password?
              </Link>
            </div>
            <div className="mt-5">
              <CustomButton
                onClick={handleSubmit}
                className="bg-primary-40 text-white"
                disabled={
                  isLoading ||
                  formValues.email === "" ||
                  formValues.password === ""
                }
                type="button"
              >
                {isLoading ? <Spinner className="border-white" /> : "Sign In"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
