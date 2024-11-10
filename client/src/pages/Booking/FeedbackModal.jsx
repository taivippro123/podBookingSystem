import React, { useState, useEffect } from "react";
import { Modal, Form, Rate, Input, notification, Button } from "antd";
import axios from "axios";

const FeedbackModal = ({ visible, onOk, onCancel, selectedBooking, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  


  useEffect(() => {
    const fetchExistingFeedback = async () => {
      if (!selectedBooking || !visible) return;
  
      const bookingId = extractBookingId(selectedBooking);
      if (!bookingId) {
        console.log("Booking ID not found.");
        return;
      }
  
      console.log("Fetching feedback for booking ID:", bookingId);
  
      setLoadingFeedback(true);
      try {
        // Gọi API để kiểm tra feedback
        const response = await axios.get(`http://localhost:5000/feedback/booking/${bookingId}`);
        console.log("Feedback API response:", response.data);
  
        if (response.data.length > 0) {
          // Nếu có dữ liệu feedback, lưu vào state và ghi log
          console.log("Existing feedback found:", response.data[0]);
          setExistingFeedback(response.data[0]);
        } else {
          // Nếu không có feedback, đặt lại state
          console.log("No existing feedback found.");
          setExistingFeedback(null);
        }
      } catch (error) {
        console.error("Error fetching existing feedback:", error);
        setExistingFeedback(null);
      } finally {
        setLoadingFeedback(false);
      }
    };
  
    if (visible) {
      fetchExistingFeedback();
    }
  }, [selectedBooking, visible]);

  //Thêm log để kiểm tra giá trị của existingFeedback khi modal mở ra:
  
  useEffect(() => {
    if (visible) {
      console.log("Modal is open. Existing feedback state:", existingFeedback);
    }
  }, [visible, existingFeedback]);
  
  
  

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

  // Handle cancel action accc
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
    title={existingFeedback ? "View Feedback" : "Submit Feedback"}
    visible={visible}
    onCancel={handleCancel}
    footer={[
      <Button key="cancel" danger onClick={handleCancel}>
        Cancel
      </Button>,
      !existingFeedback && (
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Submit
        </Button>
      ),
    ]}
  >
    {loadingFeedback ? (
      <p>Loading feedback...</p>
    ) : existingFeedback ? (
      <div>
        <h3>Rating:</h3>
        <Rate disabled value={existingFeedback.rating} />
        <h3>Feedback:</h3>
        <p>{existingFeedback.feedback}</p>
      </div>
    ) : (
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
    )}
  </Modal>
);

};

export default FeedbackModal;
