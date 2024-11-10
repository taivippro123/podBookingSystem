import React from "react";
import { Modal, Button } from "antd";

const RefundModal = ({ visible, onOk }) => {
  return (
    <Modal
      title="Refund Information"
      visible={visible}
      footer={[
        <Button
          key="ok"
          type="primary"
          style={{
            width: "112px",
            height: "32px",
            marginRight: "8px",
          }}
          onClick={onOk}
        >
          OK
        </Button>,
      ]}
    >
      <p>Your booking will be refunded in 24 hours!</p>
    </Modal>
  );
};

export default RefundModal;
