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
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Payment Details</h2>


            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Room: {roomName}</h3>
                {bookingType === 'range' ? (
                    <p className="mb-2">Date: {bookingStartDay} to {bookingEndDay}</p>
                ) : (
                    <>
                        <p className="mb-2">Date: {selectedDate}</p>
                        {/* Display the sorted slots */}
                        <p className="mb-2">Selected Slots: {sortedDisplaySlots.map(slot => `${slot.slotStartTime} - ${slot.slotEndTime}`).join(', ')}</p>
                    </>
                )}
                
                {selectedServices && selectedServices.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Selected Services:</h3>
                        <ul className="list-disc ml-6 mt-2">
                            {selectedServices.map(service => (
                                <li key={service.serviceId} className="text-gray-700">
                                    {service.serviceName} ({service.servicePrice} VND)
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <p className="text-xl font-semibold">Total Price: {totalPrice} VND</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>

                {paymentMethods.length === 0 ? (
                    <p className="text-gray-600">Loading payment methods...</p>
                ) : (
                    <div className="space-y-4">
                        {paymentMethods.map(method => (
                            <div key={method.methodId} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`method-${method.methodId}`}
                                    name="paymentMethod"
                                    value={method.methodId}
                                    checked={selectedMethod === method.methodId}
                                    onChange={() => handlePaymentMethodChange(method.methodId)}
                                    className="mr-3"
                                />
                                <label htmlFor={`method-${method.methodId}`} className="text-gray-700">
                                    {method.method}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={handleConfirmPayment}
                    disabled={!selectedMethod}
                    className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ${!selectedMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Confirm Payment
                </button>
            </div>
        </div>
    );
}

export default Payment;
