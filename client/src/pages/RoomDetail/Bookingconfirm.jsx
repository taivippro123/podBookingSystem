import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Typography, Row, Col, Input, Divider, Button, Card } from 'antd';

const { Title, Text } = Typography;

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  const [isOpen, setIsOpen] = React.useState(true);

  const paymentSummary = {
    amount: bookingDetails.price * 1000,
    discount: 0,
    subtotal: bookingDetails.price * 1000,
    tax: bookingDetails.price * 100,
    grandTotal: bookingDetails.price * 1000 + bookingDetails.price * 100,
    paymentSettled: 0,
    paymentOutstanding: bookingDetails.price * 1000 + bookingDetails.price * 100,
  };

  const handleConfirm = () => {
    console.log('Booking confirmed', { bookingDetails, paymentSummary });
    setIsOpen(false);
    navigate('/payment'); // Navigate to booking success page
  };

  const handleCancel = () => {
    setIsOpen(false);
    navigate('/rooms/:id'); // Navigate back to main page
  };

  return (
    <Modal
      title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>Booking Confirmation</Title>}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Card>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>
          {bookingDetails.roomName} ({bookingDetails.roomType})
        </Title>
        <Divider orientation="left">Booking Summary</Divider>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Date</Text>
            <Input value={bookingDetails.date} readOnly />
          </Col>
          <Col span={12}>
            <Text strong>Time</Text>
            <Input value={`${bookingDetails.startTime} - ${bookingDetails.endTime}`} readOnly />
          </Col>
          <Col span={24}>
            <Text strong>Note</Text>
            <Input.TextArea value={bookingDetails.note || 'N/A'} readOnly rows={2} />
          </Col>
        </Row>
        <Divider orientation="left">Payment Summary</Divider>
        <Row gutter={[16, 8]}>
          <Col span={12}><Text>Amount:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{paymentSummary.amount.toLocaleString()} VND</Text>
          </Col>
          <Col span={12}><Text>Discount:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{paymentSummary.discount.toLocaleString()} VND</Text>
          </Col>
          <Col span={12}><Text>Subtotal:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{paymentSummary.subtotal.toLocaleString()} VND</Text>
          </Col>
          <Col span={12}><Text>Tax:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{paymentSummary.tax.toLocaleString()} VND</Text>
          </Col>
          <Col span={12}><Text strong>Grand Total (To Pay):</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text strong>{paymentSummary.grandTotal.toLocaleString()} VND</Text>
          </Col>
          <Col span={12}><Text>Payment Settled:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{paymentSummary.paymentSettled.toLocaleString()} VND</Text>
          </Col>
          <Col span={12}><Text>Payment Outstanding:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{paymentSummary.paymentOutstanding.toLocaleString()} VND</Text>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} justify="end">
          <Col>
            <Button onClick={handleCancel}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleConfirm}>Confirm</Button>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
}
