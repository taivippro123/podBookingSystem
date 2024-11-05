import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, List, message } from "antd";
import axios from "axios";
import PaymentAddService from './PaymentAddService';

function AddServiceModal({ visible, onCancel, selectedBooking }) {
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        message.error("Failed to load services.");
      }
    };

    if (visible) {
      fetchServices();
      setSelectedServiceIds([]);
      setTotalPrice(0);
    }
  }, [visible]);

  const handleServiceChange = (checkedValues) => {
    const newTotalPrice = services
      .filter(service => checkedValues.includes(service.serviceId))
      .reduce((sum, service) => sum + parseInt(service.servicePrice, 10), 0);
    
    setSelectedServiceIds(checkedValues);
    setTotalPrice(newTotalPrice);
  };

  const handleOk = () => {
    if (selectedServiceIds.length === 0) {
      message.warning("Please select at least one service.");
      return;
    }

    // Get selected services with their details
    const selectedServices = services
      .filter(service => selectedServiceIds.includes(service.serviceId))
      .map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
      }));

    const newPaymentData = {
      bookingId: selectedBooking.bookingId, // Ensure bookingId is included
      userId: selectedBooking.userId, // Ensure userId is included
      selectedServices: selectedServices, // Ensure selected services are included
      totalPrice: totalPrice, // Total price calculated
      methodId: null // Initially set to null, will be selected in payment modal
    };

    setPaymentData(newPaymentData); // Set payment data
    setPaymentModalVisible(true); // Show the Payment Modal
    onCancel(); // Close the AddServiceModal
  };

  const handlePaymentModalClose = () => {
    setPaymentModalVisible(false); // Hide the Payment Modal
  };

  return (
    <>
      <Modal
        title="Add Services"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add Services
          </Button>,
        ]}
      >
        <div>
          <h3>Select Services to Add</h3>
          <List
            bordered
            dataSource={services}
            renderItem={service => (
              <List.Item>
                <Checkbox 
                  value={service.serviceId} 
                  checked={selectedServiceIds.includes(service.serviceId)}
                  onChange={(e) => {
                    const value = service.serviceId;
                    const newSelectedIds = e.target.checked
                      ? [...selectedServiceIds, value]
                      : selectedServiceIds.filter(id => id !== value);
                    handleServiceChange(newSelectedIds);
                  }}
                >
                  {service.serviceName} - {service.servicePrice.toLocaleString("vi-VN")} VND
                </Checkbox>
              </List.Item>
            )}
          />
          <div style={{ marginTop: 16 }}>
            <strong>Total Price: {totalPrice.toLocaleString("vi-VN")} VND</strong>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <PaymentAddService 
        paymentData={paymentData} 
        closeModal={handlePaymentModalClose} 
        visible={isPaymentModalVisible} 
      />
    </>
  );
}

export default AddServiceModal;
