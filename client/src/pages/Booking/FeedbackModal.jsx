
import React, { useState, useEffect } from "react";
import { Modal, Form, Rate, Input, message } from "antd";
import axios from "axios";

const FeedbackModal = ({
  visible,
  onOk,
  onCancel,
  selectedBooking,
  userId,
}) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!visible) {
      setFeedback("");
      setRating(0);
    }
  }, [visible]);

  const extractBookingId = (booking) => {
    // Prioritize bookingId over id
    if (booking.bookingId) return booking.bookingId;
    if (booking.id) return booking.id;
    if (booking._id) return booking._id;
    return null; // Return null if no ID is found
  };
  
  console.log("Selected Booking:", selectedBooking);
  const handleSubmit = async () => {
    if (rating === 0) {
      message.warning("Please provide a rating.");
      return;
    }
  
    if (!feedback.trim()) {
      message.warning("Please enter your feedback.");
      return;
    }
  
    if (!selectedBooking) {
      message.error("No booking selected.");
      return;
    }
  
    const bookingId = extractBookingId(selectedBooking);
  
    if (!bookingId) {
      console.error("Booking ID not found in selectedBooking:", selectedBooking);
      message.error("Invalid booking ID. Please check the booking details.");
      return;
    }
  
    console.log("Submitting Feedback with the following data:");
    console.log("bookingId:", bookingId);
    console.log("userId:", userId);
    console.log("rating:", rating);
    console.log("feedback:", feedback);
  
    try {
      const payload = {
        bookingId,
        userId,
        rating,
        feedback,
      };
  
      console.log("Payload being sent to the API:", payload);
  
      const response = await axios.post("http://localhost:5000/feedback", payload);
  
      console.log("API Response:", response);
  
      if (response.status === 201) {
        message.success("Feedback submitted successfully!");
        onOk();
        setFeedback("");
        setRating(0);
      } else {
        message.error("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Failed to submit feedback: ${error.response.data.error}`);
      } else {
        message.error("Failed to submit feedback. Please try again later.");
      }
    }
  };
  

  return (
    <Modal
      title="Feedback"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Submit"
    >
      <Form layout="vertical">
        <Form.Item label="Your Rating" required>
          <Rate
            value={rating}
            onChange={(value) => setRating(value)}
          />
        </Form.Item>
        <Form.Item label="Your Feedback" required>
          <Input.TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Enter your feedback here..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
