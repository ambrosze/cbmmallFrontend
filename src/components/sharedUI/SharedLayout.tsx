import React from "react";

interface IProps {
  children: React.ReactNode;
  className?: string;
}
const SharedLayout = ({ children, className }: IProps) => {
  return (
    <div
      className={`lg:pl-[300px] min-h-screen  pt-[10px] px-3 lg:px-5 lg:pr-[34px] ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};

export default SharedLayout;
