import useWindowResize from "@/hooks/useWindowResize";
import { Modal } from "antd";
import { twMerge } from "tailwind-merge";

interface IProps {
  children?: React.ReactNode;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  onCloseModal?: any;
  height?: number;
  width?: any;
  className?: string;
  maskCloseable?: boolean;
}

const SecondaryModal = ({
  children,
  modalOpen,
  setModalOpen,
  title,
  onCloseModal,
  height,
  width,
  className,
}: IProps) => {
  const { width: windowWidth } = useWindowResize();

  // Handle close button click
  const handleClose = () => {
    if (onCloseModal) {
      onCloseModal();
    }
    setModalOpen(false);
  };

  return (
    <>
      <Modal
        title={title}
        centered
        maskClosable={false} // This prevents closing on overlay click
        style={{
          height: windowWidth < 1000 ? undefined : height,
        }}
        width={windowWidth < 1000 ? undefined : width > 0 ? width : undefined}
        className={twMerge(" overflow-auto", className ? className : "")}
        footer={null}
        open={modalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        closeIcon={true} // Ensures X icon is visible
      >
        {children}
      </Modal>
    </>
  );
};

export default SecondaryModal;
