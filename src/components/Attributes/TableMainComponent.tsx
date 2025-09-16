import { FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, message, Table } from "antd";
import React, { isValidElement } from "react";
import * as XLSX from "xlsx";
import DeleteModal from "../sharedUI/DeleteModal";
import PlannerModal from "../sharedUI/PlannerModal";
import CustomToast from "../sharedUI/Toast/CustomToast";
import { showPlannerToast } from "../sharedUI/Toast/plannerToast";
import imgError from "/public/states/notificationToasts/error.svg";
import imgSuccess from "/public/states/notificationToasts/successcheck.svg";
interface IProps {
  data: any;
  formValues: any;
  columnsTable: any;
  refetch: () => void;
  deleteCardApi: any;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteModal: boolean;
  isDeleteLoading: boolean;
  transformedData: any;
  isLoading: boolean;
  DeleteModalText: React.ReactNode;
  bordered?: boolean;
  rowClassName?: string;
  showPrintButton?: boolean;
  printTitle?: string;
  showExportButton?: boolean;
  exportColumns?: any;
}
const TableMainComponent = ({
  data,
  refetch,
  deleteCardApi,
  setShowDeleteModal,
  showDeleteModal,
  isDeleteLoading,
  isLoading,
  transformedData,
  DeleteModalText,
  columnsTable,
  bordered = false,
  rowClassName = "",
  showPrintButton = false,
  printTitle = "Table Report",
  showExportButton = false,
  exportColumns = [], // Optional export columns, if not provided will use columnsTable
}: IProps) => {
  const handleDeleteSubmit = async () => {
    try {
      // Proceed with server-side submission
      const response = await deleteCardApi({
        id: data?.id,
      }).unwrap();
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Success"}
              title={
                <>
                  <span className="font-bold">{DeleteModalText}</span> deleted
                  Successfully
                </>
              }
              image={imgSuccess}
              textColor="green"
              message={"Thank you..."}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Please check your email for verification.",
      });
      refetch();
      setShowDeleteModal(false);
    } catch (err: any) {
      // Handle server-side errors
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={"Error"}
              title={
                <>
                  <span className="font-bold">{DeleteModalText}</span> deletion
                  failed
                </>
              }
              image={imgError}
              textColor="red"
              message={(err as any)?.data?.message || "Something went wrong"}
              backgroundColor="#FCFCFD"
            />
          ),
        },
        message: "Invalid Credentials",
      });
    }
  };

  const handlePrint = () => {
    // Use exportColumns if provided, otherwise use columnsTable and filter out actions
    const columnsToUse =
      exportColumns.length > 0
        ? exportColumns
        : columnsTable.filter((col: any) => col.dataIndex !== "action");

    // Generate table HTML from data
    const generateTableHTML = () => {
      const headers = columnsToUse
        .map((col: any) => `<th>${col.title}</th>`)
        .join("");
      console.log("🚀 ~ generateTableHTML ~ columnsToUse:", columnsToUse);

      const rows = transformedData
        .map((row: any, index: number) => {
          const cells = columnsToUse
            .map((col: any) => {
              // start with raw value
              let cellValue: any = row[col.dataIndex];

              // apply custom render fn if provided
              if (col.render) {
                const rendered = col.render(row[col.dataIndex], row, index);

                if (isValidElement(rendered as any)) {
                  cellValue =
                    rendered.props.children ?? rendered.props.href ?? "";
                } else {
                  cellValue = rendered;
                }
              }

              // Handle all object types more aggressively
              if (cellValue && typeof cellValue === "object") {
                console.log(`🚀 Object detected:`, cellValue);
                // Try to extract meaningful value from objects
                if (cellValue.props && cellValue.props.children) {
                  cellValue = cellValue.props.children;
                } else if (cellValue.props && cellValue.props.href) {
                  cellValue = cellValue.props.href;
                } else if (Array.isArray(cellValue)) {
                  cellValue = cellValue.join(", ");
                } else {
                  // Last resort: use original raw value if available
                  cellValue =
                    row[col.dataIndex] && typeof row[col.dataIndex] !== "object"
                      ? row[col.dataIndex]
                      : "[Complex Object]";
                }
              }

              // coerce to string and handle null/undefined
              const text = cellValue != null ? String(cellValue) : "-";
              console.log(`🚀 Final text:`, text);
              return `<td>${text}</td>`;
            })
            .join("");

          return `<tr class="${
            index % 2 === 0 ? "even-row" : ""
          }">${cells}</tr>`;
        })
        .join("");

      return `
        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    };

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${printTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
              th { background-color: #000; color: white; font-weight: bold; }
              .even-row { background-color: #E8E8E8; }
              .print-title { text-align: center; margin-bottom: 20px; font-size: 24px; font-weight: bold; }
              @media print { 
                body { margin: 0; }
                .no-print { display: none; }
                table { font-size: 10px; }
                th, td { padding: 4px; }
              }
            </style>
          </head>
          <body>
            <div class="print-title">${printTitle}</div>
            ${generateTableHTML()}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleExportExcel = () => {
    // Use exportColumns if provided, otherwise use columnsTable and filter out actions
    const columnsToUse =
      exportColumns.length > 0
        ? exportColumns
        : columnsTable.filter((col: any) => col.dataIndex !== "action");

    // Prepare data for Excel export
    const prepareDataForExcel = () => {
      const headers = columnsToUse.map((col: any) => col.title);

      const rows = transformedData.map((row: any, index: number) => {
        const rowData: any = {};

        columnsToUse.forEach((col: any) => {
          let cellValue: any = row[col.dataIndex];

          // Apply custom render function if exists
          if (col.render) {
            const rendered = col.render(row[col.dataIndex], row, index);
            if (isValidElement(rendered as any)) {
              cellValue = rendered.props.children ?? rendered.props.href ?? "";
            } else {
              cellValue = rendered;
            }
          }

          // Handle objects
          if (cellValue && typeof cellValue === "object") {
            if (cellValue.props && cellValue.props.children) {
              cellValue = cellValue.props.children;
            } else if (cellValue.props && cellValue.props.href) {
              cellValue = cellValue.props.href;
            } else if (Array.isArray(cellValue)) {
              cellValue = cellValue.join(", ");
            } else {
              cellValue =
                row[col.dataIndex] && typeof row[col.dataIndex] !== "object"
                  ? row[col.dataIndex]
                  : "";
            }
          }

          rowData[col.title] = cellValue != null ? String(cellValue) : "";
        });

        return rowData;
      });

      return rows;
    };

    try {
      const data = prepareDataForExcel();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `${printTitle.replace(/\s+/g, "_")}_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);
      message.success("Excel file exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export Excel file");
    }
  };

  return (
    <div>
      {(showPrintButton || showExportButton) && (
        <div className="mb-4 flex justify-end gap-2">
          {showPrintButton && (
            <Button
              type="default"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              className="no-print font-[500]"
            >
              Print Table
            </Button>
          )}
          {showExportButton && (
            <Button
              type="default"
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              className="no-print font-[500]"
            >
              Export Excel
            </Button>
          )}
        </div>
      )}
      <div id="printable-table">
        <Table<any>
          columns={columnsTable}
          dataSource={transformedData as any}
          onChange={() => {}}
          loading={isLoading}
          pagination={false}
          bordered={bordered}
          className="overflow-x-auto "
          scroll={{ x: "max-content" }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? rowClassName : ""
          }
        />
      </div>
      {showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
        >
          <DeleteModal
            handleDelete={() => {
              handleDeleteSubmit();
            }}
            isLoading={isDeleteLoading}
            onCloseModal={() => setShowDeleteModal(false)}
            title={
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold">{DeleteModalText}</span>
              </>
            }
            text="Are you sure you want to cancel?"
            altText=""
          />
        </PlannerModal>
      )}
    </div>
  );
};

export default TableMainComponent;
