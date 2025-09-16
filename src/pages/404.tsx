import Header from "@/components/header";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";

const NotFound = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <div className="">
      <Header
        search={search}
        setSearch={setSearch}
        showSearch={false}
        placeHolderText="Search product, supplier, order"
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <SharedLayout className="bg-gradient-to-b from-white to-amber-50">
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center pt-36">
          <div className="text-8xl font-thin mb-6 text-amber-600">404</div>
          <Icon icon="mdi:diamond" className="text-6xl text-amber-500 mb-8" />

          <h1 className="text-3xl md:text-4xl font-serif mb-4 text-gray-800">
            This treasure cannot be found
          </h1>

          <p className="text-lg text-gray-600 max-w-md mb-8">
            The page you're looking for has been moved or doesn't exist in our
            collection.
          </p>

          <Link
            href="/dashboard"
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white 
                     transition-colors duration-300 rounded-md shadow-md 
                     hover:shadow-lg border border-amber-700"
          >
            Return to Homepage
          </Link>
        </div>
      </SharedLayout>
    </div>
  );
};

export default NotFound;
