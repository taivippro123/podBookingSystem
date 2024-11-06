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

  // Get booked service IDs based on the selected booking
  const bookedServiceIds = selectedBooking?.services?.map(service => service.serviceId) || [];

  // Filter to get only available services that are not booked
  const availableServices = services.filter(service => !bookedServiceIds.includes(service.serviceId));

  const handleServiceChange = (checkedValues) => {
    const newTotalPrice = availableServices
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
  
    // Debugging: Log the selected booking to verify its structure
    console.log("Selected Booking:", selectedBooking);
  
    // Check if userId is valid
    if (selectedBooking.userId == null) {
      message.error("Invalid user. Please ensure that the user is correctly selected.");
      return;
    }
  
    const selectedServices = availableServices
      .filter(service => selectedServiceIds.includes(service.serviceId))
      .map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
      }));
  
    const newPaymentData = {
      bookingId: selectedBooking.bookingId,
      userId: selectedBooking.userId,
      selectedServices: selectedServices,
      totalPrice: totalPrice,
      methodId: null // Initially set to null, will be selected in payment modal
    };
  
    setPaymentData(newPaymentData);
    setPaymentModalVisible(true);
    onCancel();
  };
  

  const handlePaymentModalClose = () => {
    setPaymentModalVisible(false);
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
            dataSource={availableServices}
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
