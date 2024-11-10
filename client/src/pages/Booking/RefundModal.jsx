import React from "react";
import { Modal, Button, notification } from "antd";

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
          onClick={() => {
            onOk(); // Gọi hàm onOk
            notification.success({
              message: "Action Confirmed",
              description: "You have successfully confirmed the action.",
              duration: 3,
            });
          }}
        >
          OK
        </Button>

      ]}
    >
      <p>Your booking will be refunded in 24 hours!</p>
    </Modal>
  );
};

export default RefundModal;
