import React, { useState, useEffect } from "react";

function PaymentModal({ paymentData, closeModal }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    // Fetch available payment methods
    fetch("http://localhost:5000/getPaymentMethods")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setPaymentMethods(data.paymentMethods);
      })
      .catch((error) => console.error("Error fetching payment methods:", error));
  }, []);

  const handleConfirmPayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method!");
      return;
    }

    const paymentPayload = {
      ...paymentData,
      methodId: selectedMethod,
    };

    fetch("http://localhost:5000/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl; // Redirect for payment
        } else {
          console.error("Failed to initiate payment:", data.message);
        }
      })
      .catch((error) => console.error("Error initiating payment:", error));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg relative">
        {/* Close button (X) at the top-right */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-center">Booking Confirmation</h2>
        <h3 className="text-xl font-bold mb-2 text-center">{paymentData.roomName} </h3>
        
        {/* Booking Summary and Payment Summary */}
        <div className="flex justify-between mb-6">
          {/* Booking Summary */}
          <div className="border rounded-lg p-4 w-1/2 mr-2 text-left">
            <h4 className="text-lg font-bold mb-2">Booking Summary</h4>
            <hr style={{ border: 'none', height: '1px', backgroundColor: 'black' }} />
  

            {/* Date Range or Time Slots */}
            {paymentData.bookingType === 'range' ? (
              <><div className="flex justify-between mt-3">

                <span>Select Date Range</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span>Start Date:</span> 
                  <span>{paymentData.bookingStartDay}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span>End Date:</span> 
                  <span>{paymentData.bookingEndDay}</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <span>Available Slots</span> 
                  
                </div>
                <div className="flex justify-between">
                  <span>Date:</span> 
                  <span>{paymentData.bookingStartDay}</span>
                </div>
                <div className="flex justify-between"><span>Time Slots:</span></div>
                {paymentData.selectedSlots && paymentData.selectedSlots.length > 0 ? (
                  <ul className="list-disc ml-5 mt-3">
                    {paymentData.selectedSlots.map((slot, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{slot.slotStartTime}</span>
                        <span>-</span>
                        <span>{slot.slotEndTime}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No time slots selected</p>
                )}
              </>
            )}

            {/* Selected Services */}
            {paymentData.selectedServices && paymentData.selectedServices.length > 0 && (
              <>
                <div className="text-center mt-3">
                  <spam>Selected Services:</spam></div>
                  <div className="text-center mt-3">
                <ul>
                  {paymentData.selectedServices.map((service, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{service.serviceName}</span> 
                      <span>₫{service.servicePrice.toLocaleString("vi-VN")}</span>
                    </li>
                  ))}
                </ul>
                </div>
              </>
            )}
            {/* Discount Code and Note */}
            <div className="flex justify-between mt-3">
              <span>Discount Code:</span> 
              <span>{paymentData.discount > 0 ? "Applied" : "None"}</span>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border rounded-lg p-4 w-1/2 text-left">
            <h4 className="text-lg font-bold mb-2">Payment Summary</h4>
            <div className="flex justify-between mt-3">
              <span>Amount:</span> <span>₫{(paymentData.totalPrice + paymentData.discount).toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex justify-between mt-3">
              <span>Discount:</span> <span>-₫{paymentData.discount.toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex justify-between mt-3">
              <span>Subtotal:</span> <span>₫{paymentData.totalPrice.toLocaleString("vi-VN")}</span>
            </div>
            
            <hr className="my-2 mt-40" />
            <div className="flex justify-between font-bold mb-1 text-red-500 ">
              <span>Total:</span> <span>₫{(paymentData.totalPrice).toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 text-left">Select Payment Method</h3>
        <div className="mt-2 mb-4 text-left">
          {paymentMethods.map((method) => (
            <div key={method.methodId} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value={method.methodId}
                  checked={selectedMethod === method.methodId}
                  onChange={() => setSelectedMethod(method.methodId)}
                  className="mr-2"
                />
                {method.method}
              </label>
            </div>
          ))}
        </div>
        
        {/* Confirm and Pay Button */}
        <div className="flex space-x-2">
          <button
            onClick={closeModal}
            className="w-1/2 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            className="w-1/2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            disabled={!selectedMethod}
          >
            Confirm and Pay
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
