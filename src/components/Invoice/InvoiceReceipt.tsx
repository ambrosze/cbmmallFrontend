import { SalesDatum } from "@/types/SalesTypes";
import { formatCurrency } from "@/utils/fx";
import { PrinterOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Row, Space, Table, Typography } from "antd";
import Image from "next/image";
import Logo from "/public/images/logo-cbm.png";

const { Title, Text } = Typography;

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
}

const InvoiceReceipt = ({ selectedItem }: InvoiceReceiptProps) => {
  // Generate invoice items from the selectedItem data
  const invoiceItems: InvoiceItem[] =
    selectedItem?.sale_inventories.map((item, index) => ({
      key: index.toString(),
      type: item.inventory.item.material,
      qty: item.quantity,
      unitPrice: parseFloat(item.price_per_gram),
      tax: 0, // As per the data tax is 0
      amount: parseFloat(item.total_price),
    })) || [];

  // Calculate totals from the actual data
  const subtotal = selectedItem ? parseFloat(selectedItem.subtotal_price) : 0;
  const taxAmount = selectedItem ? parseFloat(selectedItem.tax) : 0;
  const totalExcludingTax = subtotal;
  const total = selectedItem ? parseFloat(selectedItem.total_price) : 0;
  const amountDue = total;

  // Format the date from the selectedItem
  const invoiceDate = selectedItem
    ? new Date(selectedItem.created_at).toLocaleDateString()
    : new Date().toLocaleDateString();

  // Table columns
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "right" as const,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right" as const,
      render: (price: number) => `${formatCurrency(price.toFixed(2))}`,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      align: "right" as const,
      render: (tax: number) => `${formatCurrency(tax.toFixed(2))}`,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      render: (amount: number) => `${formatCurrency(amount.toFixed(2))}`,
    },
  ];

  return (
    <Card
      className="invoice-receipt "
      style={{ maxWidth: 800, margin: "0 auto", boxShadow: "none" }}
      variant="borderless"
    >
      <Row className="border-none" justify="space-between" align="middle">
        <Col>
          <Image
            src={Logo}
            width={120}
            height={40}
            className="py-[21px]"
            alt={"Goldwise Logo"}
            sizes=""
          />
          <Title level={2}>Invoice Receipt</Title>
          <Text>Invoice #: {selectedItem?.invoice_number || "N/A"}</Text>
          <br />
          <Text>Date: {invoiceDate}</Text>
        </Col>
        <Col>
          <Space>
            <PrinterOutlined
              style={{ fontSize: 24, cursor: "pointer" }}
              onClick={() => window.print()}
            />
          </Space>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Bill To:</Text>
          <br />
          <Text>{selectedItem?.customer_name || "Customer Name"}</Text>
          <br />
          <Text>Email: {selectedItem?.customer_email || "N/A"}</Text>
          <br />
          <Text>Phone: {selectedItem?.customer_phone_number || "N/A"}</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Text strong>From:</Text>
          <br />
          <Text>CBM MALL</Text>
          <br />
          <Text>456 Business Avenue</Text>
          <br />
          <Text>Jewelry District, GW 54321</Text>
        </Col>
      </Row>

      <Divider />

      <Table
        columns={columns}
        dataSource={invoiceItems}
        pagination={false}
        bordered
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Subtotal:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatCurrency(subtotal.toFixed(2))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Total excluding Tax:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>
                  {formatCurrency(totalExcludingTax.toFixed(2))}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Tax:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatCurrency(taxAmount.toFixed(2))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Total:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatCurrency(total.toFixed(2))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Amount Due:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text type="danger" strong>
                  {formatCurrency(amountDue.toFixed(2))}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Payment Method:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{selectedItem?.payment_method || "N/A"}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Divider />

      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <Text>Thank you for your business!</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default InvoiceReceipt;
