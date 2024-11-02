import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Menu,
  Tabs,
  Card,
  Button,
  Spin,
  Alert,
  Modal,
  Form,
  message,
  Input,
  Pagination,
  Checkbox,
  Row,
  Col,
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
const { Sider, Content } = Layout;

function ViewBookings() {
  const [historyBookings, setHistoryBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [services, setServices] = useState([]);

  // Pagination states
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { Meta } = Card;

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing from URL.");
      alert("User ID is missing from URL.");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/viewbookings/${userId}`
        );
        const { history, upcoming } = response.data;
        setHistoryBookings(history);
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error("Error fetching view bookings:", error);
        alert(`Failed to fetch bookings: ${error.message}`);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/services");
        setServices(
          response.data.map((service) => ({ ...service, selected: false }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchBookings();
    fetchServices();
  }, [userId]);

  if (loading) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const showFeedbackModal = (booking) => {
    setSelectedBooking(booking);
    setIsFeedbackModalVisible(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/feedback", {
        bookingId: selectedBooking.id,
        feedback,
      });

      if (response.status === 200) {
        message.success("Feedback submitted successfully!");
        setIsFeedbackModalVisible(false);
        setFeedback("");
      } else {
        message.error("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      message.error("Failed to submit feedback. Please try again later.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setServices(services.map((service) => ({ ...service, selected: false })));
  };

  const handleOk = async () => {
    const selectedServices = services.filter((service) => service.selected);
    if (selectedServices.length === 0) {
      message.warning("Please select at least one service.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/services", {
        bookingId: selectedBooking.id,
        services: selectedServices,
      });

      if (response.status === 200) {
        message.success("Services added successfully!");
      } else {
        message.error("Failed to add services.");
      }

      setIsModalVisible(false);
      setServices(services.map((service) => ({ ...service, selected: false })));
    } catch (error) {
      console.error("Error adding services to booking:", error);
      message.error(
        "Failed to add services to the booking. Please try again later."
      );
    }
  };

  const renderBookingItem = (booking) => {
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
        <Button type="primary" onClick={() => showModal(booking)}>
          Add Services
        </Button>
      );
    } else {
      console.log("Unrecognized booking status:", booking.bookingStatus);
    }

    return (
      <Col span={12} key={booking.id}>
        <Card
          title={`Room: ${booking.roomName}`}
          extra={actionButton}
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            height: "100%", // Allow card to fill the height of the row
          }}
        >
          <div className="booking-header" style={{ marginBottom: 16 }}>
            <strong>Status: {booking.bookingStatus}</strong>
            <br></br>    

            <strong>Start: </strong>{new Date(booking.bookingStartDay).toLocaleDateString()}
            <br></br>

            <strong>End: </strong>{new Date(booking.bookingEndDay).toLocaleDateString()}
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
            {(index + 1) % 2 === 0 && (
              <div style={{ flexBasis: "100%" }} />
            )}{" "}
            {/* Force a new row every 2 cards */}
          </React.Fragment>
        ))}
      </Row>
    );
  };

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
                    <p>No upcoming bookings found.</p>
                  )}
                  <Pagination
                    current={upcomingCurrentPage}
                    pageSize={itemsPerPage}
                    total={upcomingBookings.length}
                    onChange={(page) => setUpcomingCurrentPage(page)}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Booking History" key="2">
                  {historyBookings.length > 0 ? (
                    renderBookings(historyBookingsPaginated)
                  ) : (
                    <p>No booking history found.</p>
                  )}
                  <Pagination
                    current={historyCurrentPage}
                    pageSize={itemsPerPage}
                    total={historyBookings.length}
                    onChange={(page) => setHistoryCurrentPage(page)}
                  />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* Add Services Modal */}
      <Modal
        title="Add Services"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Select Services">
            <Checkbox.Group>
              <Row>
                {services.map((service) => (
                  <Col span={8} key={service.id}>
                    <Checkbox
                      value={service.id}
                      checked={service.selected}
                      onChange={() => {
                        setServices(
                          services.map((s) =>
                            s.id === service.id
                              ? { ...s, selected: !s.selected }
                              : s
                          )
                        );
                      }}
                    >
                      {service.serviceName} (
                      {Number(service.servicePrice).toLocaleString("vi-VN")}{" "}
                      VND)
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        title="Feedback"
        visible={isFeedbackModalVisible}
        onOk={handleFeedbackSubmit}
        onCancel={() => setIsFeedbackModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Your Feedback">
            <Input.TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default ViewBookings;
