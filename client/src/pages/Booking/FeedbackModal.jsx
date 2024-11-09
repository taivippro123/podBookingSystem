import React, { useState, useEffect } from "react";
import { Modal, Form, Rate, Input, notification, Button } from "antd";
import axios from "axios";

const FeedbackModal = ({ visible, onOk, onCancel, selectedBooking, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFeedbackSubmitted(false); // Reset feedback status when modal closes
    }
  }, [visible, form]);

  // Function to extract bookingId from selectedBooking
  const extractBookingId = (booking) => {
    if (booking?.bookingId) return booking.bookingId;
    if (booking?.id) return booking.id;
    if (booking?._id) return booking._id;
    return null;
  };

  // Function to submit feedback
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { rating, feedback } = values;

      if (!userId) {
        notification.error({
          message: "Missing User ID",
          description: "User ID not found. Please log in again.",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      const bookingId = extractBookingId(selectedBooking);

      if (!bookingId) {
        notification.error({
          message: "Invalid Booking ID",
          description: "Booking ID not found. Please check again.",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      const payload = {
        bookingId,
        userId,
        rating,
        feedback,
      };

      setLoading(true);

      const response = await axios.post("http://localhost:5000/feedback", payload);

      if (response.status === 201) {
        notification.success({
          message: "Feedback Submitted Successfully",
          description: "Thank you for your feedback. You have earned reward points!",
          placement: "topRight",
          duration: 3,
        });
        setFeedbackSubmitted(true); // Update state to indicate feedback submission
        onOk();
      } else {
        notification.error({
          message: "Feedback Submission Failed",
          description: "Unable to submit feedback. Please try again.",
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response?.data?.error) {
        notification.error({
          message: "Error Submitting Feedback",
          description: `Failed to submit feedback: ${error.response.data.error}`,
          placement: "topRight",
          duration: 3,
        });
      } else if (error.message) {
        notification.error({
          message: "Connection Error",
          description: "Unable to connect to the server. Please check your network connection.",
          placement: "topRight",
          duration: 3,
        });
      } else {
        notification.error({
          message: "Unknown Error",
          description: "An unknown error occurred. Please try again later.",
          placement: "topRight",
          duration: 3,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    onCancel();
    notification.warning({
      message: "Feedback Submission Cancelled",
      description: "You have cancelled feedback submission.",
      placement: "topRight",
      duration: 3,
    });
  };

  return (
    <Modal
      title="Submit Feedback"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" danger onClick={handleCancel}>
          Cancel
        </Button>,
        feedbackSubmitted ? (
          <Button key="view" type="default" onClick={() => notification.info({
            message: "View Feedback",
            description: "You have already submitted feedback.",
            placement: "topRight",
            duration: 3,
          })}>
            View Feedback
          </Button>
        ) : (
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            Submit
          </Button>
        ),
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Your Rating"
          name="rating"
          rules={[{ required: true, message: "Please select a rating." }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          label="Your Feedback"
          name="feedback"
          rules={[{ required: true, message: "Please enter your feedback." }]}
        >
          <Input.TextArea rows={4} placeholder="Enter your feedback..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
