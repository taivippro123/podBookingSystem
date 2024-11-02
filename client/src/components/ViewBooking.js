import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Tabs, Card, Button, Spin, Alert, Modal, Form, message, Input, Pagination, Checkbox, Row, Col } from 'antd';
import { LoadingOutlined, UserOutlined, ProfileOutlined, BellOutlined, CreditCardOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';

const { Sider, Content } = Layout;

function ViewBookings() {
    const [historyBookings, setHistoryBookings] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [services, setServices] = useState([]); // List of services

    // Pagination states
    const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const itemsPerPage = 5; // Customize the number of items per page

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
                const response = await axios.get(`http://localhost:5000/viewbookings/${userId}`);
                const { history, upcoming } = response.data;
                console.log("aaaaaaaaaaaaaaaaaaaaa", upcoming); // Check the structure and content here
                console.log("bbbbbb", history);
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
                const response = await axios.get(`http://localhost:5000/services`);
                setServices(response.data.map(service => ({ ...service, selected: false })));
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchBookings();
        fetchServices();
    }, [userId]);

    if (loading) {
        return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
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
            const response = await axios.post(`http://localhost:5000/feedback`, {
                bookingId: selectedBooking.id,
                feedback,
            });

            if (response.status === 200) {
                message.success("Feedback submitted successfully!");
                setIsFeedbackModalVisible(false);
                setFeedback('');
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
        setServices(services.map(service => ({ ...service, selected: false })));
    };

    const handleOk = async () => {
        const selectedServices = services.filter(service => service.selected);
        if (selectedServices.length === 0) {
            message.warning('Please select at least one service.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/services', {
                bookingId: selectedBooking.id,
                services: selectedServices
            });

            if (response.status === 200) {
                message.success('Services added successfully!');
            } else {
                message.error('Failed to add services.');
            }

            setIsModalVisible(false);
            setServices(services.map(service => ({ ...service, selected: false })));
        } catch (error) {
            console.error("Error adding services to booking:", error);
            message.error('Failed to add services to the booking. Please try again later.');
        }
    };

    const renderBookingItem = (booking) => {
        let actionButton = null;
    
        if (booking.bookingStatus === 'Completed' || booking.bookingStatus === 'Refunded') {
            actionButton = (
                <Button type="primary" onClick={() => showFeedbackModal(booking)}>
                    Feedback
                </Button>
            );
        } else if (booking.bookingStatus === 'Upcoming' || booking.bookingStatus === 'Using') {
            actionButton = (
                <Button type="primary" onClick={() => showModal(booking)}>
                    Add Services
                </Button>
            );
        } else {
            console.log("Unrecognized booking status:", booking.bookingStatus);
        }
    
        return (
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Card
                        key={booking.id}
                        title={`Room: ${booking.roomName}`}
                        extra={actionButton}
                        style={{ marginBottom: 16 }}
                    >
                        <div className="booking-header" style={{ display: 'flex', marginBottom: 16 }}>
                            <div>
                                <p>Status: {booking.bookingStatus}</p>
                                <p>Start: {new Date(booking.bookingStartDay).toLocaleDateString()}</p>
                                <p>End: {new Date(booking.bookingEndDay).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="booking-details">
                            <strong>Slots:</strong>
                            <ul>
                                {booking.slots.map((slot, index) => (
                                    <li key={index}>
                                        {new Date(`1970-01-01T${slot.slotStartTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(`1970-01-01T${slot.slotEndTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </li>
                                ))}
                            </ul>
                            <strong>Services:</strong>
                            <ul>
                                {booking.services.map((service, index) => (
                                    <li key={index}>
                                         {service.serviceName}: {(Number(service.servicePrice)).toLocaleString('vi-VN')} VND
                                    </li>
                                ))}
                            </ul>
                            <p className=" text-red-500 mb-4"><strong>Total Price: </strong>{(Number(booking.totalPrice)).toLocaleString('vi-VN')} VND (Paid)</p>
                        </div>
                    </Card>
                </Col>
    
                {/* Duplicate the card in another column for two cards per row */}
                <Col span={12}>
                    <Card
                        key={`${booking.id}-duplicate`}
                        title={`Room: ${booking.roomName}`}
                        extra={actionButton}
                        style={{ marginBottom: 16 }}
                    >
                        <div className="booking-header" style={{ display: 'flex', marginBottom: 16,  }}>
                            <div>
                                <p>Status: {booking.bookingStatus}</p>
                                <p>Start: {new Date(booking.bookingStartDay).toLocaleDateString()}</p>
                                <p>End: {new Date(booking.bookingEndDay).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="booking-details">
                            <strong>Slots:</strong>
                            <ul>
                                {booking.slots.map((slot, index) => (
                                    <li key={index}>
                                        {new Date(`1970-01-01T${slot.slotStartTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(`1970-01-01T${slot.slotEndTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </li>
                                ))}
                            </ul>
                            <strong>Services:</strong>
                            <ul>
                                {booking.services.map((service, index) => (
                                    <li key={index}>
                                        {service.serviceName}: {(Number(service.servicePrice)).toLocaleString('vi-VN')} VND
                                    </li>
                                ))}
                            </ul>
                            <p className='text-red-500 mb-4'><strong>Total Price: </strong>{(Number(booking.totalPrice)).toLocaleString('vi-VN')} VND</p>
                        </div>
                    </Card>
                </Col>
            </Row>
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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']} items={[
                        { key: '1', icon: <UserOutlined />, label: 'User account Name' },
                        { key: '2', icon: <ProfileOutlined />, label: 'Profile Information' },
                        { key: '3', icon: <CreditCardOutlined />, label: 'My booking' },
                        { key: '4', icon: <BellOutlined />, label: 'Notification' },
                    ]} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />
                    </Header>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                            <h1>View Bookings</h1>
                            <Tabs
                                defaultActiveKey="1"
                                items={[
                                    {
                                        key: "1",
                                        label: "Upcoming Bookings",
                                        children: (
                                            <>
                                                {upcomingBookingsPaginated.length > 0 ? (
                                                    upcomingBookingsPaginated.map((booking) => renderBookingItem(booking))
                                                ) : (
                                                    <p>No upcoming bookings.</p>
                                                )}
                                                <Pagination
                                                    current={upcomingCurrentPage}
                                                    pageSize={itemsPerPage}
                                                    total={upcomingBookings.length}
                                                    onChange={(page) => setUpcomingCurrentPage(page)}
                                                    style={{ textAlign: 'center', marginTop: 16 }}
                                                />
                                            </>
                                        ),
                                    },
                                    {
                                        key: "2",
                                        label: "Booking History",
                                        children: (
                                            <>
                                                {historyBookingsPaginated.length > 0 ? (
                                                    historyBookingsPaginated.map((booking) => renderBookingItem(booking))
                                                ) : (
                                                    <p>No booking history available.</p>
                                                )}
                                                <Pagination
                                                    current={historyCurrentPage}
                                                    pageSize={itemsPerPage}
                                                    total={historyBookings.length}
                                                    onChange={(page) => setHistoryCurrentPage(page)}
                                                    style={{ textAlign: 'center', marginTop: 16 }}
                                                />
                                            </>
                                        ),
                                    },
                                ]}
                            />

                        </Content>
                    </Layout>
                </Layout>
            </Layout>



            {/* Modal for adding services */}
            <Modal
                title="Add Service"
                open={isModalVisible} // changed from `visible`
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
                cancelText="Cancel"
            >
                <div>
                    {services.length > 0 ? (
                        <Checkbox.Group
                            value={services.filter(service => service.selected).map(service => service.serviceId)}
                            onChange={(selectedServiceIds) => {
                                const updatedServices = services.map(service => ({
                                    ...service,
                                    selected: selectedServiceIds.includes(service.serviceId),
                                }));
                                setServices(updatedServices);
                            }}
                        >
                            <Row gutter={[16, 24]}>
                                {services.map(service => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={service.serviceId}>
                                        <Card hoverable>
                                            <Meta
                                                title={service.serviceName}
                                                description={`${service.servicePrice} VND`}
                                            />
                                            <Checkbox value={service.serviceId} style={{ marginTop: 16 }}>
                                                Select
                                            </Checkbox>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    ) : (
                        <p>No available services</p>
                    )}
                </div>
            </Modal>


            {/* Feedback Modal */}
            <Modal
                title="Feedback"
                open={isFeedbackModalVisible} // changed from `visible`
                onOk={handleFeedbackSubmit}
                onCancel={() => setIsFeedbackModalVisible(false)}
                okText="Submit"
                cancelText="Cancel"
            >
                <Form>
                    <Form.Item label="Feedback">
                        <Input.TextArea
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter your feedback here"
                        />
                    </Form.Item>
                </Form>
            </Modal>

        </Layout>
    );
}

export default ViewBookings;
