import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, List, Card, Divider, Typography, message, Avatar, Empty, notification } from "antd";
import { ShoppingCartOutlined, CloseOutlined, InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import PaymentAddService from "./PaymentAddService";

const { Text, Title } = Typography;

function AddServiceModal({ visible, onCancel, selectedBooking }) {
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchAvailableServices = async () => {
      try {
        if (!selectedBooking?.bookingId) {
          message.error("Invalid booking ID.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/services/not-booked/${selectedBooking.bookingId}`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        message.error("Failed to load services.");
      }
    };

    if (visible) {
      fetchAvailableServices();
      setSelectedServiceIds([]);
      setTotalPrice(0);
    }
  }, [visible, selectedBooking]);

  const handleServiceChange = (checkedValues) => {
    const newTotalPrice = services
      .filter((service) => checkedValues.includes(service.serviceId))
      .reduce((sum, service) => sum + parseInt(service.servicePrice, 10), 0);

    setSelectedServiceIds(checkedValues);
    setTotalPrice(newTotalPrice);
  };

  const handleOk = () => {
    if (selectedServiceIds.length === 0) {
      message.warning("Please select at least one service.");
      return;
    }

    if (!selectedBooking?.userId) {
      message.error("Invalid user. Please ensure the user is correctly selected.");
      return;
    }

    const selectedServices = services
      .filter((service) => selectedServiceIds.includes(service.serviceId))
      .map((service) => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
      }));

    const newPaymentData = {
      bookingId: selectedBooking.bookingId,
      userId: selectedBooking.userId,
      selectedServices,
      totalPrice,
      methodId: null,
    };

    setPaymentData(newPaymentData);
    setPaymentModalVisible(true);
    onCancel();
  };

  const handlePaymentModalClose = () => {
    setPaymentModalVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    notification.warning({
      message: "Action Canceled",
      description: "You have canceled the service selection process.",
      placement: "topRight",
      duration: 3,
    });
  };

  return (
    <>
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1890ff",
            }}
          >
            WorkZone Service
          </div>
        }
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="reset"
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedServiceIds([]);
              notification.info({
                message: "Selection Reset",
                description: "All selected services have been cleared.",
                placement: "topRight",
                duration: 3,
              });
            }}
            danger
          >
            Reset Selection
          </Button>,
          <Button
            key="cancel"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
          key="submit"
          type="primary"
          onClick={() => {
            handleOk();
            notification.success({
              message: "Services Added",
              description: "The selected services have been successfully added.",
              placement: "topRight",
              duration: 3,
            });
          }}
          disabled={selectedServiceIds.length === 0} // Nút sẽ bị disable nếu chưa chọn dịch vụ nào
        >
          <ShoppingCartOutlined /> Add Services
        </Button>
        
        ]}
        closeIcon={<CloseOutlined />}
        bodyStyle={{ padding: "20px" }}
      >
        <Title level={4} style={{ color: "#1890ff", marginBottom: "10px" }}>
          <ShoppingCartOutlined /> Available Services
        </Title>
        <Divider />

        {services.length === 0 ? (
          <Empty description="No available services" />
        ) : (
          <List
            bordered
            dataSource={services}
            renderItem={(service) => (
              <Card
                key={service.serviceId}
                style={{
                  marginBottom: "10px",
                  borderRadius: "8px",
                  backgroundColor: selectedServiceIds.includes(service.serviceId) ? "#e6f7ff" : "#fff",
                }}
                hoverable
                onClick={() => {
                  const newSelectedIds = selectedServiceIds.includes(service.serviceId)
                    ? selectedServiceIds.filter((id) => id !== service.serviceId)
                    : [...selectedServiceIds, service.serviceId];
                  handleServiceChange(newSelectedIds);
                }}
              >
                <Card.Meta
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {service.serviceName}
                      <InfoCircleOutlined style={{ marginLeft: "8px", color: "#1890ff" }} />
                    </div>
                  }
                  description={<Text strong>{Number(service.servicePrice).toLocaleString("vi-VN")} VND</Text>}
                />
                <Checkbox
                  checked={selectedServiceIds.includes(service.serviceId)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newSelectedIds = checked
                      ? [...selectedServiceIds, service.serviceId]
                      : selectedServiceIds.filter((id) => id !== service.serviceId);
                    handleServiceChange(newSelectedIds);
                  }}
                  style={{ marginTop: "10px" }}
                >
                  Select
                </Checkbox>
              </Card>
            )}
            style={{ maxHeight: "300px", overflowY: "auto" }}
          />
        )}

        {services.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <Text strong>Total Price: </Text>
            <Text style={{ fontSize: "18px", color: "#ff4d4f" }}>{totalPrice.toLocaleString("vi-VN")} VND</Text>
          </div>
        )}
      </Modal>

      <PaymentAddService
        paymentData={paymentData}
        closeModal={handlePaymentModalClose}
        visible={isPaymentModalVisible}
      />
    </>
  );
}

export default AddServiceModal;
