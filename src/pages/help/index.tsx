import AttributeHeader from "@/components/Attributes/AttributeHeader";
import Header from "@/components/header";
import SharedLayout from "@/components/sharedUI/SharedLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Card, Collapse, Drawer, Steps } from "antd";
import { useState } from "react";

const { Panel } = Collapse;

const index = () => {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "mdi:rocket-launch",
    },
    { id: "dashboard", title: "Dashboard", icon: "mdi:view-dashboard" },
    {
      id: "inventory",
      title: "Inventory Management",
      icon: "mdi:package-variant",
    },
    { id: "sales", title: "Sales Management", icon: "mdi:point-of-sale" },
    {
      id: "stock-transfer",
      title: "Stock Transfer",
      icon: "mdi:truck-delivery",
    },
    { id: "attributes", title: "Product Attributes", icon: "mdi:tag-multiple" },
    { id: "admin", title: "Admin Features", icon: "mdi:shield-crown" },
    { id: "tips", title: "Tips & Best Practices", icon: "mdi:lightbulb" },
  ];

  const gettingStartedSteps = [
    {
      title: "Login to System",
      description:
        "Enter your email and password provided by your administrator",
      icon: "mdi:login",
    },
    {
      title: "Explore Dashboard",
      description:
        "View your business overview including sales, inventory, and staff statistics",
      icon: "mdi:chart-line",
    },
    {
      title: "Set Up Inventory",
      description: "Add your jewelry items, categories, and product details",
      icon: "mdi:plus-circle",
    },
    {
      title: "Start Selling",
      description: "Process sales, generate invoices, and track your business",
      icon: "mdi:cash-register",
    },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false); // Close mobile menu when section is selected
  };

  const renderSidebarContent = () => (
    <div className="bg-gray-50 rounded-lg p-4 h-fit">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Navigation</h3>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
              activeSection === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
            }`}
          >
            <Icon icon={item.icon} className="text-lg flex-shrink-0" />
            <span className="font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return (
          <div className="space-y-6">
            <Card className="border border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <Icon
                  icon="mdi:information"
                  className="text-blue-600 text-2xl"
                />
                <h3 className="text-xl font-semibold text-blue-800">
                  Welcome to CBM MALL!
                </h3>
              </div>
              <p className="text-blue-700 mb-4">
                This application helps you manage your jewelry business
                efficiently. Follow these simple steps to get started:
              </p>
            </Card>

            <Steps
              direction="vertical"
              current={-1}
              items={gettingStartedSteps.map((step, index) => ({
                title: step.title,
                description: step.description,
                icon: <Icon icon={step.icon} className="text-lg" />,
              }))}
            />

            <Card className="bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-green-600 text-xl"
                />
                <span className="text-green-800 font-medium">
                  Ready to start? Navigate to the Dashboard from the sidebar!
                </span>
              </div>
            </Card>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:view-dashboard" className="text-blue-600" />
              Understanding Your Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    icon="mdi:currency-usd"
                    className="text-green-600 text-xl"
                  />
                  <h4 className="font-semibold">Sales Overview</h4>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  View your total sales amount, number of transactions, and
                  average sale value.
                </p>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    icon="mdi:package-variant"
                    className="text-blue-600 text-xl"
                  />
                  <h4 className="font-semibold">Inventory Status</h4>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Monitor your stock levels, low stock alerts, and out-of-stock
                  items.
                </p>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    icon="mdi:account-group"
                    className="text-purple-600 text-xl"
                  />
                  <h4 className="font-semibold">Staff & Users</h4>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Track active staff members and user activity across your
                  stores.
                </p>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    icon="mdi:chart-bar"
                    className="text-orange-600 text-xl"
                  />
                  <h4 className="font-semibold">Top Selling Items</h4>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  See which jewelry pieces are performing best in your business.
                </p>
              </Card>
            </div>
          </div>
        );

      case "inventory":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:package-variant" className="text-blue-600" />
              Managing Your Inventory
            </h2>

            <Collapse defaultActiveKey={["1"]} ghost>
              <Panel
                header={
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon icon="mdi:eye" className="text-blue-600" />
                    Viewing Items
                  </div>
                }
                key="1"
              >
                <div className="pl-2 md:pl-6 space-y-3 text-sm md:text-base">
                  <p>
                    • Go to <strong>Inventory → Items</strong> in the sidebar
                  </p>
                  <p>• Use the search bar to find specific items</p>
                  <p>• Filter by store, category, type, or color</p>
                  <p>
                    • View item details including weight, price, and barcode
                  </p>
                  <p>• Print barcodes in small or large sizes</p>
                </div>
              </Panel>

              <Panel
                header={
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon icon="mdi:truck" className="text-green-600" />
                    Stock Transfers
                  </div>
                }
                key="2"
              >
                <div className="pl-2 md:pl-6 space-y-3 text-sm md:text-base">
                  <p>• Create transfers between stores</p>
                  <p>• Assign drivers and track delivery status</p>
                  <p>• Accept or reject incoming transfers</p>
                  <p>• View transfer history and details</p>
                </div>
              </Panel>

              <Panel
                header={
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon icon="mdi:alert" className="text-orange-600" />
                    Stock Alerts
                  </div>
                }
                key="3"
              >
                <div className="pl-2 md:pl-6 space-y-3 text-sm md:text-base">
                  <p>• Monitor low stock items on your dashboard</p>
                  <p>• Check out-of-stock items that need restocking</p>
                  <p>• Set up automatic alerts for inventory levels</p>
                </div>
              </Panel>
            </Collapse>
          </div>
        );

      case "sales":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:point-of-sale" className="text-blue-600" />
              Processing Sales
            </h2>

            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:lightbulb"
                  className="text-yellow-600 text-xl mt-1 flex-shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Quick Tip
                  </h4>
                  <p className="text-yellow-700 text-sm md:text-base">
                    Always check current gold prices before processing sales to
                    ensure accurate pricing!
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:plus-circle" className="text-green-600" />
                  Creating a New Sale
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm md:text-base">
                  <li>
                    Go to <strong>Sales → Sales</strong> from the sidebar
                  </li>
                  <li>
                    Click <strong>"Create Sales"</strong> button
                  </li>
                  <li>Enter customer information (name, phone, email)</li>
                  <li>Select payment method (Cash, ATM, Transfer, Cheque)</li>
                  <li>Add items to the sale by selecting from inventory</li>
                  <li>Apply discount codes if applicable</li>
                  <li>Review total amount and complete the sale</li>
                </ol>
              </Card>

              <Card>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:receipt" className="text-blue-600" />
                  Managing Sales Records
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm md:text-base">
                  <li>View all sales with customer details and amounts</li>
                  <li>Generate and print invoices</li>
                  <li>Edit sales information if needed</li>
                  <li>View detailed breakdown of sold items</li>
                  <li>Track payment methods and transaction history</li>
                </ul>
              </Card>
            </div>
          </div>
        );

      case "stock-transfer":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:truck-delivery" className="text-blue-600" />
              Stock Transfer Guide
            </h2>

            <div className="grid gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <h4 className="font-semibold mb-3">Creating a Transfer</h4>
                <div className="space-y-2 text-gray-700 text-sm md:text-base">
                  <p>
                    1. Navigate to <strong>Inventory → Stock transfer</strong>
                  </p>
                  <p>
                    2. Click <strong>"Create Stock Transfer"</strong>
                  </p>
                  <p>3. Select destination store</p>
                  <p>4. Enter driver details (name and phone)</p>
                  <p>5. Select items and quantities to transfer</p>
                  <p>6. Add any comments or special instructions</p>
                </div>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <h4 className="font-semibold mb-3">Transfer Status</h4>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm w-fit">
                      New
                    </span>
                    <span className="text-sm md:text-base">
                      Transfer created but not yet dispatched
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm w-fit">
                      Dispatched
                    </span>
                    <span className="text-sm md:text-base">
                      Items are on their way to destination
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm w-fit">
                      Accepted
                    </span>
                    <span className="text-sm md:text-base">
                      Items received and accepted at destination
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm w-fit">
                      Rejected
                    </span>
                    <span className="text-sm md:text-base">
                      Transfer rejected with reason
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case "attributes":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:tag-multiple" className="text-blue-600" />
              Product Attributes
            </h2>

            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm md:text-base">
              Product attributes help you organize and categorize your jewelry
              items for better inventory management.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center hover:shadow-md transition-shadow">
                <Icon
                  icon="mdi:folder-multiple"
                  className="text-blue-600 text-3xl mx-auto mb-3"
                />
                <h4 className="font-semibold mb-2">Categories</h4>
                <p className="text-gray-600 text-sm">
                  Group items by type (e.g., Rings, Necklaces, Bracelets)
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Go to Attributes → Category
                </p>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <Icon
                  icon="mdi:shape"
                  className="text-green-600 text-3xl mx-auto mb-3"
                />
                <h4 className="font-semibold mb-2">Types</h4>
                <p className="text-gray-600 text-sm">
                  Define specific types within categories
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Go to Attributes → Types
                </p>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <Icon
                  icon="mdi:palette"
                  className="text-purple-600 text-3xl mx-auto mb-3"
                />
                <h4 className="font-semibold mb-2">Colors</h4>
                <p className="text-gray-600 text-sm">
                  Set up color options with hex codes
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Go to Attributes → Colours
                </p>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-800">
                Best Practice:
              </h4>
              <p className="text-blue-700 text-sm md:text-base">
                Set up your categories, types, and colors before adding
                inventory items for better organization.
              </p>
            </Card>
          </div>
        );

      case "admin":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:shield-crown" className="text-blue-600" />
              Admin Features
            </h2>

            <Card className="bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <Icon
                  icon="mdi:shield-alert"
                  className="text-red-600 text-xl flex-shrink-0"
                />
                <span className="text-red-800 font-medium text-sm md:text-base">
                  Admin features require special permissions
                </span>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:account-group" className="text-blue-600" />
                  Staff Management
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
                  <li>Add new staff members</li>
                  <li>Assign roles and permissions</li>
                  <li>Manage store assignments</li>
                  <li>View staff activity</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:store" className="text-green-600" />
                  Store Management
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
                  <li>Create and manage store locations</li>
                  <li>Assign store managers</li>
                  <li>Set headquarters designation</li>
                  <li>Track store performance</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:gold" className="text-yellow-600" />
                  Daily Gold Prices
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
                  <li>Update daily gold rates</li>
                  <li>Set prices by category</li>
                  <li>View price history</li>
                  <li>Automatic pricing calculations</li>
                </ul>
              </Card>

              <Card>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="mdi:percent" className="text-purple-600" />
                  Discount Management
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
                  <li>Create discount codes</li>
                  <li>Set percentage discounts</li>
                  <li>Manage expiry dates</li>
                  <li>Track discount usage</li>
                </ul>
              </Card>
            </div>
          </div>
        );

      case "tips":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Icon icon="mdi:lightbulb" className="text-blue-600" />
              Tips & Best Practices
            </h2>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-green-500 bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2">
                  💡 Daily Operations
                </h4>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm md:text-base">
                  <li>Check your dashboard first thing in the morning</li>
                  <li>Update gold prices before processing sales</li>
                  <li>Monitor low stock alerts regularly</li>
                  <li>Process stock transfers promptly</li>
                </ul>
              </Card>

              <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2">
                  📊 Inventory Management
                </h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm md:text-base">
                  <li>Set up proper categories before adding items</li>
                  <li>Use descriptive names for easy searching</li>
                  <li>Keep barcodes for quick identification</li>
                  <li>Regular inventory audits are important</li>
                </ul>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                <h4 className="font-semibold text-purple-800 mb-2">
                  💰 Sales Tips
                </h4>
                <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm md:text-base">
                  <li>Always verify gold prices before quoting</li>
                  <li>Keep customer information updated</li>
                  <li>Print receipts for all transactions</li>
                  <li>Use discount codes to attract customers</li>
                </ul>
              </Card>

              <Card className="border-l-4 border-l-orange-500 bg-orange-50">
                <h4 className="font-semibold text-orange-800 mb-2">
                  🔒 Security
                </h4>
                <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm md:text-base">
                  <li>Log out when leaving your workstation</li>
                  <li>Keep your password secure and private</li>
                  <li>Report any suspicious activity immediately</li>
                  <li>Regular data backups are essential</li>
                </ul>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-0">
              <div className="text-center">
                <Icon
                  icon="mdi:help-circle"
                  className="text-4xl text-blue-600 mx-auto mb-3"
                />
                <h4 className="font-semibold text-lg mb-2">Need More Help?</h4>
                <p className="text-gray-700 mb-4 text-sm md:text-base">
                  Contact your system administrator or IT support team for
                  additional assistance.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                  <span className="bg-white px-3 py-1 rounded-full">
                    📧 admin@goldwise.com
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full">
                    📞 +1-234-567-8900
                  </span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      <Header
        search={search}
        setSearch={setSearch}
        placeHolderText=""
        showSearch={false}
        handleOpenSideNavBar={() => {}}
        isOpenSideNavBar
      />
      <AttributeHeader
        headerText="User Guide & Documentation"
        btnText=""
        showAddButton={false}
        onClick={() => {}}
      />
      <SharedLayout className="bg-white py-4 md:py-10">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
          >
            <Icon icon="mdi:menu" className="text-lg" />
            Navigation Menu
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 sticky top-6">
            {renderSidebarContent()}
          </div>

          {/* Mobile Drawer */}
          <Drawer
            title="Navigation"
            placement="left"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            width={300}
            className="lg:hidden"
          >
            {renderSidebarContent()}
          </Drawer>

          {/* Main Content */}
          <div className="flex-1 max-w-none lg:max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </SharedLayout>
    </div>
  );
};

export default index;
