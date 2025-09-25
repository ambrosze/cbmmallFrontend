import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.snow.css";

// react-quill should be loaded client-side only
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  value: string;
  onChange: (val: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
}

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["link", "blockquote", "code-block"],
  ["clean"],
];

export default function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  errorMessage,
  className,
}: Props) {
  return (
    <div>
      {label && (
        <div className="pb-1">
          <label className="text-sm capitalize text-[#2C3137]">{label}</label>
        </div>
      )}
      <div className="border border-gray-300 rounded-[8px]  overflow-hidden">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${className}`}
          modules={{ toolbar: toolbarOptions }}
        />
      </div>
      {errorMessage ? (
        <p className="flex flex-col gap-1 text-xs italic text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
