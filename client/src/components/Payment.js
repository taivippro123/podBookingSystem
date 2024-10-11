import React, { useState, useEffect } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const { roomId, roomName, totalPrice, userId, bookingStartDay, bookingEndDay, selectedServices, selectedSlots, bookingType, selectedDate, discount } = location.state || {};

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);

    useEffect(() => {
        // Fetch payment methods from the backend
        fetch('http://localhost:5000/getPaymentMethods')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setPaymentMethods(data.paymentMethods); // Set payment methods dynamically
                } else {
                    console.error('Failed to fetch payment methods:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching payment methods:', error);
            });
    }, []);

    const handlePaymentMethodChange = (methodId) => {
        setSelectedMethod(methodId);
    };

    const handleConfirmPayment = () => {
        if (selectedMethod) {
            if (selectedMethod !== 3) { // Check if the selected method is not ZaloPay
                alert("This payment method is coming soon!");
                return; // Prevent further execution if the method is not ZaloPay
            }
    
            // Sort the selected slots based on slotStartTime
            const sortedSlots = selectedSlots.sort((a, b) => 
                new Date(`1970-01-01T${a.slotStartTime}`) - new Date(`1970-01-01T${b.slotStartTime}`)
            );
    
            const paymentData = {
                roomId,
                roomName,
                totalPrice,
                bookingType,
                selectedSlots: sortedSlots, // Use the sorted slots here
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
            alert("Please select a payment method!");
        }
    };
    

    // Sort slots for display
    const sortedDisplaySlots = selectedSlots.sort((a, b) =>
        new Date(`1970-01-01T${a.slotStartTime}`) - new Date(`1970-01-01T${b.slotStartTime}`)
    );

    return (
        <div>
            <h2>Payment Details</h2>
            <p>Room: {roomName}</p>

            {bookingType === 'range' ? (
                <p>Date: {bookingStartDay} to {bookingEndDay}</p>
            ) : (
                <>
                    <p>Date: {selectedDate}</p>
                    {/* Display the sorted slots */}
                    <p>Selected Slots: {sortedDisplaySlots.map(slot => `${slot.slotStartTime} - ${slot.slotEndTime}`).join(', ')}</p>
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
            {paymentMethods.length === 0 ? (
                <p>Loading payment methods...</p>
            ) : (
                paymentMethods.map(method => (
                    <div key={method.methodId}>
                        <input
                            type="radio"
                            id={`method-${method.methodId}`}
                            name="paymentMethod"
                            value={method.methodId}
                            checked={selectedMethod === method.methodId}
                            onChange={() => handlePaymentMethodChange(method.methodId)}
                        />
                        <label htmlFor={`method-${method.methodId}`}>{method.method}</label>
                    </div>
                ))
            )}

            <button onClick={handleConfirmPayment} disabled={!selectedMethod}>
                Confirm Payment
            </button>
        </div>
    );
}

export default Payment;
