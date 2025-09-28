import { SalesDatum } from "@/types/SalesTypes";
import { formatCurrency } from "@/utils/fx";
import { PrinterOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Row, Space, Typography } from "antd";
import dynamic from "next/dynamic";
import Image from "next/image";
import Logo from "/public/images/logo-cbm.png";

const { Text } = Typography;

interface InvoiceItem {
  key: string;
  type: string;
  qty: number;
  unitPrice: number;
  tax: number;
  amount: number;
}

interface InvoiceReceiptProps {
  selectedItem: SalesDatum | null;
  storeInfo?: {
    name?: string;
    addressLines?: string[];
    phone?: string;
  };
}

const InvoiceReceipt = ({ selectedItem, storeInfo }: InvoiceReceiptProps) => {
  const invoiceItems: InvoiceItem[] =
    selectedItem?.sale_inventories.map((item: any, index) => ({
      key: index.toString(),
      type:
        item?.inventory?.product_variant?.name ||
        item?.inventory?.item?.material ||
        "Item",
      qty: item.quantity,
      unitPrice: parseFloat((item as any).price || item.price_per_gram || 0),
      tax: 0,
      amount: parseFloat(item.total_price),
    })) || [];

  const subtotal = selectedItem ? parseFloat(selectedItem.subtotal_price) : 0;
  const taxAmount = selectedItem ? parseFloat(selectedItem.tax) : 0;
  const total = selectedItem ? parseFloat(selectedItem.total_price) : 0;
  const amountDue = total;

  const createdAt = selectedItem
    ? new Date(selectedItem.created_at)
    : new Date();
  const invoiceDate = createdAt.toLocaleDateString();
  const invoiceTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const barcodeValue =
    (selectedItem as any)?.barcode ||
    (selectedItem as any)?.metadata?.barcode ||
    selectedItem?.invoice_number ||
    "";

  // Resolve store info for this sale
  const saleLevelStore =
    (selectedItem as any)?.store ||
    (selectedItem as any)?.store_details ||
    (selectedItem as any)?.store_info;
  const inventoryStores: any[] = ((selectedItem as any)?.sale_inventories || [])
    .map((si: any) => si?.inventory?.store)
    .filter(Boolean);
  const uniqueStores: any[] = Object.values(
    inventoryStores.reduce((acc: any, s: any) => {
      const id = s?.id || `${s?.name}-${s?.address || ""}`;
      if (s && !acc[id]) acc[id] = s;
      return acc;
    }, {})
  );
  const chosenStore =
    saleLevelStore || (uniqueStores.length === 1 ? uniqueStores[0] : null);
  const multipleStores = !saleLevelStore && uniqueStores.length > 1;
  const effectiveStoreInfo = {
    name:
      storeInfo?.name ||
      (multipleStores ? "Multiple Stores" : chosenStore?.name) ||
      "CBM MALL",
    addressLines:
      storeInfo?.addressLines ||
      (multipleStores
        ? []
        : [
            chosenStore?.address,
            [chosenStore?.city, chosenStore?.country]
              .filter(Boolean)
              .join(", "),
          ].filter(Boolean)),
    phone:
      storeInfo?.phone ||
      (multipleStores ? "" : chosenStore?.phone_number) ||
      "",
  } as Required<NonNullable<InvoiceReceiptProps["storeInfo"]>>;

  const Barcode = dynamic(() => import("react-barcode"), { ssr: false }) as any;

  // Print by opening a lightweight new window with only the receipt markup
  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const wrapper = document.getElementById("printable-receipt");
    if (!wrapper) return window.print();
    const receiptHTML = wrapper.outerHTML;
    const styles = `
      <style>
        @page { size: 80mm auto; margin: 5mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff; }
        .receipt { width: 80mm; margin: 0 auto; }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .row { display:flex; justify-content:space-between; align-items:baseline; }
        .small { font-size: 12px; }
        .xs { font-size: 11px; }
        .divider { border-top: 1px dashed #000; margin: 6px 0; }
        .row-grid { display:grid; grid-template-columns:16px 1fr 36px 64px 72px; column-gap:8px; align-items:start; }
        .cell { border-right: 1px dashed #000; padding-right:8px; }
        .cell:last-child { border-right:0; }
        .cell-right { text-align:right; }
        .cell-item { word-break: break-word; white-space: normal; }
        .tear-top { height:10px; background: linear-gradient(-45deg, transparent 75%, #fff 75%), linear-gradient(45deg, transparent 75%, #fff 75%); background-size:10px 10px; background-repeat:repeat-x; background-position:left bottom, left bottom; }
        * { break-inside: avoid; page-break-inside: avoid; }
        /* Ensure header is centered and icon is hidden when printing */
        .text-center { text-align: center; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mb-1 { margin-bottom: 0.25rem; }
        .no-print { display: none !important; visibility: hidden !important; }
        /* Space after phone for cleaner look */
        .phone-line { padding-bottom: 15px; }
      </style>
    `;
    const w = window.open("", "_blank", "width=420,height=800");
    if (!w) return;
    w.document.open();
    w.document.write(
      `<!doctype html><html><head><meta charset='utf-8'/>${styles}</head><body>${receiptHTML}</body></html>`
    );
    w.document.close();
    setTimeout(() => {
      try {
        w.print();
      } finally {
        w.close();
      }
    }, 150);
  };

  return (
    <Card
      className="invoice-receipt"
      style={{ maxWidth: 420, margin: "0 auto", boxShadow: "none" }}
      variant="borderless"
    >
      <style jsx global>{`
        /* Serrated top edge for screen */
        .tear-top {
          height: 10px;
          background: linear-gradient(-45deg, transparent 75%, #fff 75%),
            linear-gradient(45deg, transparent 75%, #fff 75%);
          background-size: 10px 10px;
          background-repeat: repeat-x;
          background-position: left bottom, left bottom;
        }

        /* Screen defaults so main view matches print layout */
        .receipt {
          width: 320px;
          margin: 0 auto;
          background: #fff;
        }
        .receipt .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
        }
        .receipt .row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .receipt .small {
          font-size: 12px;
        }
        .receipt .xs {
          font-size: 11px;
        }
        .receipt .divider {
          border-top: 1px dashed #000;
          margin: 6px 0;
        }
        .receipt .row-grid {
          display: grid;
          grid-template-columns: 16px 1fr 36px 64px 72px;
          column-gap: 8px;
          align-items: start;
        }
        .receipt .cell {
          border-right: 1px dashed #000;
          padding-right: 8px;
        }
        .receipt .cell:last-child {
          border-right: 0;
        }
        .receipt .cell-right {
          text-align: right;
        }
        .receipt .cell-item {
          word-break: break-word;
          white-space: normal;
        }
      `}</style>

      <div id="printable-receipt" className="receipt p-0">
        <div className="tear-top" />
        <div className="p-2">
          <Row className="border-none" justify="space-between" align="middle">
            <Col flex="auto">
              <div className="text-center">
                <Image
                  src={Logo}
                  width={56}
                  height={56}
                  className="mx-auto mb-1"
                  alt={"Store Logo"}
                  sizes="56px"
                />
                <div className="font-serif text-[18px] tracking-wide font-bold">
                  {effectiveStoreInfo.name}
                </div>
                <div className="mono xs leading-tight mt-1">
                  {effectiveStoreInfo.addressLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  {effectiveStoreInfo.phone ? (
                    <div className="phone-line">
                      Phone: {effectiveStoreInfo.phone}
                    </div>
                  ) : null}
                </div>
              </div>

              <Divider className="my-2" />

              <div className="mono small row">
                <div>
                  <span className="font-semibold">BILL NO:</span>{" "}
                  <span className="font-bold">
                    {selectedItem?.invoice_number || "—"}
                  </span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span>{invoiceDate}</span>
                  <span className="tabular-nums">{invoiceTime}</span>
                </div>
              </div>

              <div className="mono small mt-1">
                {selectedItem?.customer_name ? (
                  <div>Customer: {selectedItem.customer_name}</div>
                ) : null}
                {selectedItem?.customer_phone_number ? (
                  <div>Phone: {selectedItem.customer_phone_number}</div>
                ) : null}
                {selectedItem?.customer_email ? (
                  <div>Email: {selectedItem.customer_email}</div>
                ) : null}
                {((selectedItem as any)?.cashier?.user?.name ||
                  (selectedItem as any)?.cashier_name) && (
                  <div>
                    Cashier:{" "}
                    {(selectedItem as any)?.cashier?.user?.name ||
                      (selectedItem as any)?.cashier_name}
                  </div>
                )}
              </div>
            </Col>
            <Col className="no-print">
              <Space>
                <PrinterOutlined
                  style={{ fontSize: 24, cursor: "pointer" }}
                  onClick={handlePrint}
                />
              </Space>
            </Col>
          </Row>

          <div className="divider" />
          <div className="mono xs row-grid font-semibold opacity-90">
            <span className="cell">#</span>
            <span className="cell">Item</span>
            <span className="cell cell-right">Qty</span>
            <span className="cell cell-right">Rate</span>
            <span className="cell cell-right">Amt</span>
          </div>
          <div className="divider" />

          <div className="mono small">
            {invoiceItems.length === 0 ? (
              <div className="text-center opacity-70 py-2">No items</div>
            ) : (
              invoiceItems.map((it, idx) => (
                <div key={it.key} className="row-grid py-1">
                  <span className="cell">{idx + 1}</span>
                  <span className="cell cell-item">{it.type}</span>
                  <span className="cell cell-right">{it.qty}</span>
                  <span className="cell cell-right">
                    {formatCurrency(it.unitPrice.toFixed(2))}
                  </span>
                  <span className="cell cell-right">
                    {formatCurrency(it.amount.toFixed(2))}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="divider" />

          <div className="mono small space-y-1">
            <div className="row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal.toFixed(2))}</span>
            </div>
            {(selectedItem as any)?.metadata?.discount?.amount ? (
              <div className="row">
                <span>
                  Discount
                  {(selectedItem as any)?.metadata?.discount?.code
                    ? ` (${(selectedItem as any)?.metadata?.discount?.code})`
                    : ""}
                </span>
                <span>
                  -
                  {formatCurrency(
                    (
                      (selectedItem as any)?.metadata?.discount?.amount || 0
                    ).toFixed(2)
                  )}
                </span>
              </div>
            ) : null}
            <div className="row">
              <span>Tax</span>
              <span>{formatCurrency(taxAmount.toFixed(2))}</span>
            </div>
            <div className="row font-bold">
              <span>TOTAL</span>
              <span>{formatCurrency(total.toFixed(2))}</span>
            </div>
            <div className="row">
              <span>Payment</span>
              <span>{selectedItem?.payment_method || "N/A"}</span>
            </div>
            <div className="row">
              <span>Amount Due</span>
              <span>{formatCurrency(amountDue.toFixed(2))}</span>
            </div>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          {barcodeValue ? (
            <div className="flex flex-col items-center justify-center py-2">
              {/* @ts-ignore */}
              <Barcode
                value={barcodeValue}
                format="CODE128"
                height={36}
                displayValue={true}
                fontSize={12}
                background="#fff"
              />
            </div>
          ) : null}

          <Divider className="my-2" />

          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Text className="small">Thank you. Visit again.</Text>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceReceipt;
