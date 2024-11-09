import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentAddService({ paymentData, closeModal, visible }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSelectMethod = (methodId) => {
    if (methodId !== 3) {
      toast.warning("Please select ZaloPay payment method.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setSelectedMethod(methodId);
  };

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";

      fetch("http://localhost:5000/getPaymentMethods")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPaymentMethods(data.paymentMethods);
          } else {
            console.error("Failed to fetch payment methods:", data.message);
            toast.error("Failed to fetch payment methods. Please try again later.", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching payment methods:", error);
          toast.error("Error fetching payment methods. Please try again later.", {
            position: "top-center",
            autoClose: 3000,
          });
        });

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [visible]);

  const handleConfirmPayment = () => {
    if (!selectedMethod) {
      toast.warning("Please select a payment method!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const paymentPayload = {
      bookingId: paymentData.bookingId,
      userId: paymentData.userId,
      selectedServices: paymentData.selectedServices.map((service) => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
      })),
      totalPrice: paymentData.totalPrice,
      methodId: selectedMethod,
    };

    console.log("Sending payment payload:", JSON.stringify(paymentPayload, null, 2));

    fetch("http://localhost:5000/add-service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to initiate payment");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          console.error("Failed to initiate payment:", data.message);
          toast.error("Payment initiation failed: " + data.message, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error initiating payment:", error);
        toast.error("Error initiating payment: " + error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-10/12 md:w-8/12 lg:w-6/12 max-w-md p-4 md:p-6 rounded-lg shadow-lg relative mt-16 overflow-y-auto max-h-screen">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">Booking Confirmation</h2>
          <h3 className="text-lg font-bold mb-2 text-center">{paymentData?.roomName}</h3>

          <div className="border rounded-lg p-4 w-full text-left mb-4">
            <h4 className="text-lg font-bold mb-2">Payment Summary</h4>
            <div>
              <div><strong>Total Price:</strong> {paymentData?.totalPrice.toLocaleString("vi-VN")} VND</div>
              <div><strong>Selected Services:</strong></div>
              <ul>
                {paymentData?.selectedServices.map((service, index) => (
                  <li key={index}>{service.serviceName} - {Number(service.servicePrice).toLocaleString("vi-VN")} VND</li>
                ))}
              </ul>
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
                    onChange={() => handleSelectMethod(method.methodId)}
                    className="mr-2"
                  />
                  {method.method}
                </label>
              </div>
            ))}
          </div>

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

      {/* Toastify Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default PaymentAddService;
