import Image from 'next/image'
import React from 'react'

const EmptyState = ({ children, textHeader }: { children?: React.ReactNode, textHeader?: string }) => {
  return (
    <div className='flex flex-col mt-10 justify-center items-center'>
      <Image
        src="/images/empty_box.svg"
        alt="empty-state"
        width={200}
        height={200}
      />

      <div className="">
        {textHeader && (
          <h3 className="text-[20px] p-0 leading-6 w-[80%] mx-auto  font-semibold text-[#48505E] mt-5 text-center">
            {textHeader}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}

export default EmptyState