// src/views/ViewBookings.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Menu,
  Tabs,
  Card,
  Button,
  Spin,
  Alert,
  Pagination,
  Row,
  Col,
  message,
  Modal,
  notification 
} from "antd";
import {
  LoadingOutlined,
  UserOutlined,
  ProfileOutlined,
  BellOutlined,
  CreditCardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import AddServiceModal from "../pages/Booking/AddServiceModal";
import FeedbackModal from "../pages/Booking/FeedbackModal";
import RefundModal from "../pages/Booking/RefundModal";

import { useNavigate } from "react-router-dom"; // Import useNavigate


const { Sider, Content } = Layout;

function ViewBookings() {
  const [historyBookings, setHistoryBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [isAddServiceModalVisible, setIsAddServiceModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState("1");



  // Pagination states
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { Meta } = Card;
  // Hàm hiển thị thông báo thành công
const showSuccessNotification = (message, description) => {
  notification.success({
    message,
    description,
    duration: 3,
  });
};

// Hàm hiển thị thông báo lỗi
const showErrorNotification = (message, description) => {
  notification.error({
    message,
    description,
    duration: 3,
  });
};

// Hàm hiển thị thông báo cảnh báo
const showWarningNotification = (message, description) => {
  notification.warning({
    message,
    description,
    duration: 3,
  });
};


  // Kiểm tra xem booking có feedback hay không
  const checkFeedbackStatus = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/feedback/booking/${bookingId}`);
      return response.data.length > 0; // True nếu đã có feedback
    } catch (error) {
      console.error(`Error checking feedback for booking ${bookingId}:`, error);
      return false;
    }
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!userId) {
      showErrorNotification("Error", "User ID is missing from URL.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/viewbookings/${userId}`);
      const { history, upcoming } = response.data;
  
      const transformBookings = async (bookings) => {
        return await Promise.all(
          bookings.map(async (booking) => {
            const hasFeedback = await checkFeedbackStatus(booking.id);
            return { ...booking, hasFeedback };
          })
        );
      };
  
      setHistoryBookings(await transformBookings(history));
      setUpcomingBookings(await transformBookings(upcoming));
    } catch (error) {
      showErrorNotification("Error", "Failed to fetch bookings. Please try again later.");
      setError(error.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm cập nhật trạng thái feedback của booking
  const updateBookingFeedbackStatus = async (bookingId) => {
    try {
      const hasFeedback = await checkFeedbackStatus(bookingId);

      // Cập nhật trạng thái trong danh sách bookings
      setUpcomingBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, hasFeedback } : booking
        )
      );

      setHistoryBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, hasFeedback } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking feedback status:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchBookings(); // Initial fetch
    fetchServices();
  }, [userId]);

  const addServiceToBooking = async (bookingId, serviceId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/booking/${bookingId}/add-service`,
        { serviceId }
      );
      message.success(response.data.message); // Show success message
      return true; // Indicate success
    } catch (error) {
      console.error("Error adding service:", error);
      message.error(error.response?.data?.error || "Failed to add service.");
      return false; // Indicate failure
    }
  };
  const handleAddServiceSuccess = async (addedServiceIds) => {
    setIsAddServiceModalVisible(false);
    setSelectedBooking(null);
  
    const successfulAdds = await Promise.all(
      addedServiceIds.map(async (serviceId) => {
        return await addServiceToBooking(selectedBooking.id, serviceId);
      })
    );
  
    if (successfulAdds.every((success) => success)) {
      showSuccessNotification("Success", "Services added to booking successfully.");
      const updatedUpcomingBookings = upcomingBookings.map((booking) => {
        if (booking.id === selectedBooking.id) {
          const newServices = selectedBooking.services.filter((service) => addedServiceIds.includes(service.id));
          booking.services = [...booking.services, ...newServices];
          booking.totalPrice += newServices.reduce((total, service) => total + service.servicePrice, 0);
        }
        return booking;
      });
  
      setUpcomingBookings(updatedUpcomingBookings);
    } else {
      showErrorNotification("Error", "Failed to add some services.");
    }
  };
  

  //hiện thị refundModal
  const showRefundModal = () => {
    setIsRefundModalVisible(true);
  };

  const handleRefundModalOk = () => {
    setIsRefundModalVisible(false);
  };

 

  // Function to cancel a booking
  const cancelBooking = async (bookingId) => {
    if (!bookingId || !userId) {
      showErrorNotification("Error", "Booking ID and User ID are required.");
      return;
    }
  
    try {
      const response = await axios.put(
        "http://localhost:5000/cancelBooking",
        { bookingId, userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        showSuccessNotification("Success", "Booking successfully cancelled.");
        await fetchBookings();
        setActiveTabKey("2");
      } else {
        showErrorNotification("Cancellation Failed", response.data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      showErrorNotification("Error", error.response?.data?.message || "Error cancelling booking.");
    }
  };
  


  const confirmCancelBooking = (booking) => {
    Modal.confirm({
      title: "Confirm Cancellation",
      content: "Are you sure you want to cancel this booking?",
      okText: "Yes, Cancel it",
      cancelText: "No",
      onOk: () => cancelBooking(booking.bookingId), // Gọi hàm cancelBooking nếu người dùng ấn "Yes"
      onCancel: () => {
        console.log("User cancelled the cancellation request.");
      },
    });
  };




  const showAddServiceModal = (booking) => {
    console.log("Selected Booking for Add Service:", booking);
    setSelectedBooking(booking); // Set selectedBooking correctly
    setIsAddServiceModalVisible(true); // Open the modal
  };

  const showFeedbackModal = (booking) => {
    console.log("Selected Booking for Feedback:", booking);
    setSelectedBooking(booking);
    setIsFeedbackModalVisible(true);
  };

  const handleFeedbackSuccess = async () => {
    setIsFeedbackModalVisible(false);

    if (selectedBooking?.id) {
      const bookingId = selectedBooking.id;

      console.log("Selected Booking ID:", bookingId);

      // Cập nhật trực tiếp state của upcomingBookings
      setUpcomingBookings((prevBookings) => {
        const updatedBookings = prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, hasFeedback: true } : booking
        );
        console.log("Updated Upcoming Bookings:", updatedBookings);
        return updatedBookings;
      });

      // Cập nhật trực tiếp state của historyBookings
      setHistoryBookings((prevBookings) => {
        const updatedBookings = prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, hasFeedback: true } : booking
        );
        console.log("Updated History Bookings:", updatedBookings);
        return updatedBookings;
      });

      // Gọi fetchBookings để làm mới dữ liệu từ API
      console.log("Fetching bookings from API...");
      await fetchBookings();

      // Xóa selectedBooking sau khi cập nhật xong
      setSelectedBooking(null);
    }
  };
  const renderBookingItem = (booking) => {
    console.log("Rendering booking:", booking);
    let actionButton = null;


    if (booking.bookingStatus === "Completed") {
      if (booking.hasFeedback) {
        actionButton = (
          <Button type="default" onClick={() => showFeedbackModal(booking)}>
            View Feedback
          </Button>
        );
      } else {
        actionButton = (
          <Button type="primary" onClick={() => showFeedbackModal(booking)}>
            Feedback
          </Button>
        );
      }
    } else if (booking.bookingStatus === "Upcoming" || booking.bookingStatus === "Using") {
      actionButton = (
        <>
          <Button
            type="primary"
            style={{
              width: "112px",
              height: "32px",
              marginRight: "8px",
            }}
            onClick={() => showAddServiceModal(booking)}
          >
            Add Service
          </Button>
          <Button
            type="danger"
            style={{
              width: "112px",
              height: "32px",
              marginRight: "8px",
              backgroundColor: "rgb(188 187 187)", // Màu nền xám đậm
              borderColor: "rgb(188 187 187)",
              color: "#fff",
            }}
            onClick={() => {
              console.log("Cancel button clicked. Booking:", booking);
              confirmCancelBooking(booking);
            }}
          >
            Cancel
          </Button>
        </>

      );
    } else if (booking.bookingStatus === "Cancelled") {
      actionButton = (
        <>
          <Button
            type="primary"
            style={{
              width: "112px",
              height: "32px",
              marginRight: "8px",
            }}
            onClick={showRefundModal}
          >
            Refunded
          </Button>

        </>

      );
    } else {
      console.log("Unrecognized booking status:", booking.bookingStatus);
    }

    const bookingKey = booking.id;

    return (
      <Col span={12} key={bookingKey}>
        <Card
          title={`Room: ${booking.roomName}`}
          extra={actionButton}
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div className="booking-header" style={{ marginBottom: 16 }}>
            <strong>Status: {booking.bookingStatus}</strong>
            <br />
            <strong>Start: </strong>
            {new Date(booking.bookingStartDay).toLocaleDateString()}
            <br />
            <strong>End: </strong>
            {new Date(booking.bookingEndDay).toLocaleDateString()}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ marginBottom: "10px" }}>
              <strong>Slots:</strong>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {booking.slots.map((slot, index) => (
                  <li key={index}>
                    {new Date(`1970-01-01T${slot.slotStartTime}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(`1970-01-01T${slot.slotEndTime}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Services:</strong>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {booking.services.map((service, index) => (
                  <li key={index}>
                    {service.serviceName}: {Number(service.servicePrice).toLocaleString("vi-VN")} VND
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              <strong style={{ marginRight: "4px" }}>Total Price:</strong>
              <p style={{ margin: 0 }}>
                {Number(booking.totalPrice).toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>
        </Card>
      </Col>
    );
  };





  const upcomingBookingsPaginated = upcomingBookings.slice(
    (upcomingCurrentPage - 1) * itemsPerPage,
    upcomingCurrentPage * itemsPerPage
  );

  const historyBookingsPaginated = historyBookings.slice(
    (historyCurrentPage - 1) * itemsPerPage,
    historyCurrentPage * itemsPerPage
  );

  const renderBookings = (bookings) => {
    return (
      <Row gutter={16} style={{ display: "flex", alignItems: "stretch" }}>
        {bookings.map((booking, index) => (
          <React.Fragment key={booking.id}>
            {renderBookingItem(booking)}
            {(index + 1) % 2 === 0 && <div style={{ flexBasis: "100%" }} />}
          </React.Fragment>
        ))}
      </Row>
    );
  };

  if (loading) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }



  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Layout>
          <Header
            style={{
              padding: "0 16px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>View Bookings</h2>
          </Header>


          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Tabs
                activeKey={activeTabKey}
                onChange={(key) => setActiveTabKey(key)}
                defaultActiveKey="1"
              >
                <Tabs.TabPane tab="Upcoming Bookings" key="1">
                  {upcomingBookings.length > 0 ? (
                    renderBookings(upcomingBookingsPaginated)
                  ) : (
                    <p style={{ textAlign: 'center', color: '#999' }}>No upcoming bookings found.</p>
                  )}
                  <Pagination
                    current={upcomingCurrentPage}
                    pageSize={itemsPerPage}
                    total={upcomingBookings.length}
                    onChange={(page) => setUpcomingCurrentPage(page)}
                    style={{ marginTop: 16, textAlign: "center" }}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Booking History" key="2">
                  {historyBookings.length > 0 ? (
                    renderBookings(historyBookingsPaginated)
                  ) : (
                    <p style={{ textAlign: 'center', color: '#999' }}>No booking history found.</p>
                  )}
                  <Pagination
                    current={historyCurrentPage}
                    pageSize={itemsPerPage}
                    total={historyBookings.length}
                    onChange={(page) => setHistoryCurrentPage(page)}
                    style={{ marginTop: 16, textAlign: "center" }}
                  />
                </Tabs.TabPane>
              </Tabs>

            </div>
          </Content>
        </Layout>
      </Layout>

      {/* Add Service Modal */}
      <AddServiceModal
        visible={isAddServiceModalVisible}
        onOk={handleAddServiceSuccess}
        onCancel={() => {
          setIsAddServiceModalVisible(false);
          setSelectedBooking(null); // Clear selection when modal closes
        }}
        selectedBooking={selectedBooking} // Pass the selected booking
      />
      {/* Feedback Modal */}
      <FeedbackModal
        visible={isFeedbackModalVisible}
        onOk={handleFeedbackSuccess}
        onCancel={() => {
          setIsFeedbackModalVisible(false);
          setSelectedBooking(null);
        }}
        selectedBooking={selectedBooking}
        userId={userId}
      />
      {/* Feedback Modal */}
      <RefundModal
        visible={isRefundModalVisible}
        onOk={handleRefundModalOk}
      />

    </Layout>
  );
}

export default ViewBookings;
