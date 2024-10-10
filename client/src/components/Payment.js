import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const { roomId, roomName, totalPrice, userId, bookingStartDay, bookingEndDay, selectedServices, selectedSlots, bookingType, selectedDate, discount } = location.state || {};

    const [selectedMethod, setSelectedMethod] = useState(null);

    const paymentMethods = [
        { id: 1, name: "Credit Card" },
        { id: 2, name: "PayPal" },
        { id: 3, name: "E-Wallet" }
    ];

    const handlePaymentMethodChange = (methodId) => {
        setSelectedMethod(methodId);
    };

    const handleConfirmPayment = () => {
        if (selectedMethod === 3) {
            const paymentData = {
                roomId,
                roomName,
                totalPrice,
                bookingType,
                selectedSlots,
                selectedDate,
                selectedServices, // Include selected services in the payment
                bookingStartDay,
                bookingEndDay,
                userId,
                discount,
                methodId: selectedMethod
            };

            fetch('http://localhost:5000/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;  // Redirect to payment page
                } else {
                    console.error("Failed to initiate payment:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error initiating payment:", error);
            });
        } else {
            alert("This payment method is coming soon!");
        }
    };

    return (
        <div>
            <h2>Payment Details</h2>
            <p>Room: {roomName}</p>

            {bookingType === 'range' ? (
                <p>Date: {bookingStartDay} to {bookingEndDay}</p>
            ) : (
                <>
                    <p>Date: {selectedDate}</p>
                    <p>Selected Slots: {selectedSlots.map(slot => `${slot.slotStartTime} - ${slot.slotEndTime}`).join(', ')}</p>
                </>
            )}

            {/* Display selected services */}
            {selectedServices && selectedServices.length > 0 && (
                <div>
                    <h3>Selected Services:</h3>
                    <ul>
                        {selectedServices.map(service => (
                            <li key={service.serviceId}>{service.serviceName} ({service.servicePrice} VND)</li>
                        ))}
                    </ul>
                </div>
            )}

            <p>Total Price: {totalPrice} VND</p>

            <h3>Select Payment Method</h3>
            {paymentMethods.map(method => (
                <div key={method.id}>
                    <input
                        type="radio"
                        id={`method-${method.id}`}
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={() => handlePaymentMethodChange(method.id)}
                    />
                    <label htmlFor={`method-${method.id}`}>{method.name}</label>
                    {(method.id === 1 || method.id === 2) && <span> (Coming soon)</span>}
                </div>
            ))}

            <button onClick={handleConfirmPayment} disabled={!selectedMethod}>
                Confirm Payment
            </button>
        </div>
    );
}

export default Payment;
