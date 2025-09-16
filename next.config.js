/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],

  env: {
    baseUrl: `${process.env.NEXT_PUBLIC_BASEURL}/api/`,
    imageBaseUrl: `${process.env.NEXT_PUBLIC_IMAGE_FILE_BASEURL}`,
    fileBaseUrl: `${process.env.NEXT_PUBLIC_IMAGE_FILE_BASEURL}`,
  },

  images: {
    domains: [
      "api.goldwisejewelry.com/storage",
      "api.goldwisejewelry.com",
      "ui-avatars.com",
      "http://api.goldwisejewelry.com/storage",
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
