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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [services, setServices] = useState([]);

  // Pagination states
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { Meta } = Card;

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!userId) {
      console.error("User ID is missing from URL.");
      alert("User ID is missing from URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/viewbookings/${userId}`
      );
      const { history, upcoming } = response.data;

      const transformBookings = (bookings) =>
        bookings.map((booking) => ({
          ...booking,
          id: userId, // Alias '_id' to 'id'
        }));

      setHistoryBookings(transformBookings(history));
      setUpcomingBookings(transformBookings(upcoming));
    } catch (error) {
      console.error("Error fetching view bookings:", error);
      setHistoryBookings([]); // Set to empty on error
      setUpcomingBookings([]); // Set to empty on error
      setError(null); // Clear the error state
    } finally {
      setLoading(false);
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

    // Logic to integrate added services with the selected booking
    const successfulAdds = await Promise.all(
      addedServiceIds.map(async (serviceId) => {
        return await addServiceToBooking(selectedBooking.id, serviceId);
      })
    );

    // Update the upcoming bookings state if all adds were successful
    if (successfulAdds.every(success => success)) {
      const updatedUpcomingBookings = upcomingBookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          const newServices = selectedBooking.services.filter(service => addedServiceIds.includes(service.id)); // Example logic
          booking.services = [...booking.services, ...newServices]; // Append new services
          // Update total price
          booking.totalPrice += newServices.reduce((total, service) => total + service.servicePrice, 0);
        }
        return booking;
      });

      setUpcomingBookings(updatedUpcomingBookings); // Update state
    }
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

  const handleFeedbackSuccess = () => {
    setIsFeedbackModalVisible(false);
    setSelectedBooking(null);
  };

  const renderBookingItem = (booking) => {
    console.log("Rendering booking:", booking);
    let actionButton = null;

    if (
      booking.bookingStatus === "Completed" ||
      booking.bookingStatus === "Refunded"
    ) {
      actionButton = (
        <Button type="primary" onClick={() => showFeedbackModal(booking)}>
          Feedback
        </Button>
      );
    } else if (
      booking.bookingStatus === "Upcoming" ||
      booking.bookingStatus === "Using"
    ) {
      actionButton = (
        <Button type="primary" onClick={() => showAddServiceModal(booking)}>
          Add Service
        </Button>
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
                    {new Date(
                      `1970-01-01T${slot.slotStartTime}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(
                      `1970-01-01T${slot.slotEndTime}`
                    ).toLocaleTimeString([], {
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
                    {service.serviceName}:{" "}
                    {Number(service.servicePrice).toLocaleString("vi-VN")} VND
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
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["3"]}
            items={[
              { key: "1", icon: <UserOutlined />, label: "Account" },
              { key: "2", icon: <ProfileOutlined />, label: "Profile" },
              { key: "3", icon: <BellOutlined />, label: "Bookings" },
              { key: "4", icon: <CreditCardOutlined />, label: "Payments" },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: "#fff" }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Tabs defaultActiveKey="1">
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
    </Layout>
  );
}

export default ViewBookings;
