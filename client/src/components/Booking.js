    import React, { useState, useEffect, useLocation } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';

    function Booking() {
        const [userId, setUserId] = useState(null);
        const { id } = useParams(); // Get roomId from the URL
        const [bookingType, setBookingType] = useState('slot'); // 'slot' or 'range'
        const [availableSlots, setAvailableSlots] = useState([]);
        const [selectedSlots, setSelectedSlots] = useState([]);
        const [dateRange, setDateRange] = useState({ start: '', end: '' });
        const [services, setServices] = useState([]);
        const [useUserPoints, setUseUserPoints] = useState(false);
        const [roomDetail, setRoomDetail] = useState(null);
        const [totalPrice, setTotalPrice] = useState(0);
        const [isRoomAvailable, setIsRoomAvailable] = useState(null);
        const [userPoints, setUserPoints] = useState([]);
        const [error, setError] = useState('');
        const [selectedDate, setSelectedDate] = useState('');

        const navigate = useNavigate();

        useEffect(() => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
            setUserId(userData.userId);
            }
            console.log("Current userId in localStorage:", userData ? userData.userId : null);
            // Fetch room details
            fetch(`http://localhost:5000/room-details/${id}`)
                .then((res) => res.json())
                .then((data) => setRoomDetail(data));

            // Fetch available slots
            if (bookingType === 'slot') {
                const today = new Date().toISOString().split('T')[0];
                fetchAvailableSlots(today);
            }

            // Fetch services
            fetchServices();

            // Fetch user points
            fetchUserPoints();
        }, [id, bookingType]);

        const fetchAvailableSlots = (date) => {
            fetch(`http://localhost:5000/available-slots/${id}?date=${date}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log('Available slots:', data);
                    setAvailableSlots(data);
                })
                .catch((error) => console.error('Error fetching available slots:', error));
        };

        const fetchServices = () => {
            fetch('http://localhost:5000/services')
                .then((res) => res.json())
                .then((data) => {
                    console.log('Raw services data:', data);
                    const formattedServices = data.map(service => ({
                        ...service,
                        servicePrice: Number(service.servicePrice)
                    }));
                    console.log('Formatted services:', formattedServices);
                    setServices(formattedServices);
                })
                .catch((error) => console.error('Error fetching services:', error));
        };

        const fetchUserPoints = () => {
            const userData = JSON.parse(localStorage.getItem('user')); // Retrieve the user data
            const userId = userData ? userData.userId : null; // Safely access userId
            console.log('Fetching user points for userId:', userId);
        
            if (userId) {
                fetch(`http://localhost:5000/user-points/${userId}`)
                    .then((res) => {
                        console.log('Response status:', res.status);
                        return res.json();
                    })
                    .then((data) => {
                        console.log('Raw user points data:', data);
                        if (data && data.userPoint !== undefined) {
                            setUserPoints(Number(data.userPoint));
                            console.log('Set user points to:', Number(data.userPoint));
                        } else {
                            console.error('Invalid user points data:', data);
                            setUserPoints(0); // Handle case where userPoint is not available
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching user points:', error);
                        setUserPoints(0); // Set to 0 in case of error
                    });
            } else {
                console.error('No userId found in localStorage');
                setUserPoints(0); // Handle case where userId is missing
            }
        };
        

        const handleBookingTypeChange = (e) => {
            setBookingType(e.target.value);
            setSelectedSlots([]);
        };

        const handleDateChange = (e) => {
            const { name, value } = e.target;
            let newDateRange = { ...dateRange, [name]: value };

            if (name === 'start') {
                // If changing start date, ensure end date is not before start date
                if (newDateRange.end && new Date(value) > new Date(newDateRange.end)) {
                    newDateRange.end = value;
                }
            } else if (name === 'end') {
                // If changing end date, ensure it's not before start date
                if (newDateRange.start && new Date(value) < new Date(newDateRange.start)) {
                    return; // Don't update if end date is before start date
                }
            }

            setDateRange(newDateRange);
        };

        const handleSlotSelection = (slot) => {
            setSelectedSlots(prevSelectedSlots => {
                if (prevSelectedSlots.some(s => s.slotId === slot.slotId)) {
                    return prevSelectedSlots.filter(s => s.slotId !== slot.slotId);
                } else {
                    return [...prevSelectedSlots, slot];
                }
            });
        };

        const calculateDaysBetween = (start, end) => {
            const startDate = new Date(start);
            const endDate = new Date(end);
            const timeDiff = endDate.getTime() - startDate.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
        };

        const calculateTotalPrice = () => {
            if (!roomDetail) {
                console.log('Room details not loaded yet');
                return;
            }

            console.log('Room Detail:', roomDetail);
            console.log('Booking Type:', bookingType);
            console.log('Selected Slots:', selectedSlots);
            console.log('Date Range:', dateRange);
            console.log('Services:', services);

            let price = 0;
            if (bookingType === 'slot') {
                price = selectedSlots.length * (roomDetail?.roomPricePerSlot || 0);
                console.log('Slot Price:', price);
            } else if (bookingType === 'range') {
                const days = calculateDaysBetween(dateRange.start, dateRange.end);
                console.log('Days:', days);
                const weeksCount = Math.floor(days / 7);
                const remainingDays = days % 7;

                if (days < 7) {
                    price = days * (roomDetail?.roomPricePerDay || 0);
                } else {
                    price = (weeksCount * (roomDetail?.roomPricePerWeek || 0)) + (remainingDays * (roomDetail?.roomPricePerDay || 0));
                }
                console.log('Range Price:', price);
            }

            const selectedServicePrice = services.reduce((sum, service) => {
                console.log(`Service: ${service.serviceName}, Price: ${service.servicePrice}, Selected: ${service.selected}`);
                return service.selected ? sum + (Number(service.servicePrice) || 0) : sum;
            }, 0);
            console.log('Total Service Price:', selectedServicePrice);

            const discount = useUserPoints ? Math.min(userPoints, price * 0.1) : 0;
            console.log('Discount:', discount);

            const finalPrice = price + selectedServicePrice - discount;
            console.log('Final Price:', finalPrice);

            setTotalPrice(finalPrice);
        };

        useEffect(() => {
            if (roomDetail) {
                calculateTotalPrice();
            }
        }, [roomDetail, bookingType, useUserPoints, services, selectedSlots, dateRange]);

        const checkRoomAvailability = () => {
            if (dateRange.start && dateRange.end) {
                fetch(`http://localhost:5000/available-rooms/${id}?startDate=${dateRange.start}&endDate=${dateRange.end}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log('Room availability:', data);
                        setIsRoomAvailable(data.available);
                    })
                    .catch((error) => console.error('Error checking room availability:', error));
            }
        };

        useEffect(() => {
            if (bookingType !== 'slot' && dateRange.start && dateRange.end) {
                checkRoomAvailability();
            }
        }, [bookingType, dateRange]);

        useEffect(() => {
            console.log('userPoints updated:', userPoints);
        }, [userPoints]);

        const handleDateSelection = (e) => {
            setSelectedDate(e.target.value);
            fetchAvailableSlots(e.target.value);
        };

        const handleNavigateToPayment = () => {

            let bookingStartDay, bookingEndDay;

            const discount = useUserPoints ? Math.min(userPoints, totalPrice * 0.1) : 0;
            
            if (bookingType === 'slot') {
                if (!selectedDate) {
                    setError('Please select a date.');
                    return;
                }
                if (selectedSlots.length === 0) {
                    setError('Please select at least one time slot.');
                    return;
                }
                bookingStartDay = selectedDate;
                bookingEndDay = selectedDate;
                
            } else if (bookingType === 'range') {
                if (!dateRange.start || !dateRange.end) {
                    setError('Please select both start and end dates.');
                    return;
                }
                if (!isRoomAvailable) {
                    setError('The room is not available for the selected dates.');
                    return;
                }
                bookingStartDay = dateRange.start;
                bookingEndDay = dateRange.end;
            }
            setError('');
        
            // Collect selected services
            const selectedServices = services.filter(service => service.selected);
        
            const paymentData = {
                roomId: id,
                roomName: roomDetail.roomName,
                totalPrice,
                bookingType,
                selectedServices, // Pass selected services here
                selectedSlots,
                selectedDate,
                bookingStartDay,
                bookingEndDay,
                discount,
                userId
            };
        
            navigate('/payment', { state: paymentData });
        };
        
        

        return (
            <div>
                <h2>Booking for Room: {roomDetail?.roomName}</h2>

                {/* Booking Type Selection */}
                <div>
                    <label>
                        <input
                            type="radio"
                            value="slot"
                            checked={bookingType === 'slot'}
                            onChange={handleBookingTypeChange}
                        />{' '}
                        Book by Slot
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="range"
                            checked={bookingType === 'range'}
                            onChange={handleBookingTypeChange} 
                        />{' '}
             dateRange           Book by Date Range
                    </label>
                </div>

                {/* Display error message */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Booking by Slot */}
                {bookingType === 'slot' && (
                    <div>
                        <h3>Available Slots</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateSelection}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {availableSlots.length > 0 ? (
                            <ul>
                                {availableSlots.map((slot) => (
                                    <li key={slot.slotId}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedSlots.some(s => s.slotId === slot.slotId)}
                                                onChange={() => handleSlotSelection(slot)}
                                            />
                                            {slot.slotStartTime} - {slot.slotEndTime}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No available slots</p>
                        )}
                    </div>
                )}

                {/* Booking by Date Range */}
                {bookingType === 'range' && (
                    <div>
                        <h3>Select Date Range</h3>
                        <label>
                            Start Date:
                            <input
                                type="date"
                                name="start"
                                value={dateRange.start}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </label>
                        <label>
                            End Date:
                            <input
                                type="date"
                                name="end"
                                value={dateRange.end}
                                onChange={handleDateChange}
                                min={dateRange.start || new Date().toISOString().split('T')[0]}
                            />
                        </label>
                        {isRoomAvailable !== null && (
                            <p>
                                {isRoomAvailable
                                    ? "Room is available for the selected dates."
                                    : "Room is not available for the selected dates. Please choose different dates."}
                            </p>
                        )}
                    </div>
                )}

                {/* Show Services */}
                <div>
                    <h3>Available Services</h3>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <label key={service.serviceId}>
                                <input
                                    type="checkbox"
                                    checked={service.selected}
                                    onChange={(e) => {
                                        const updatedServices = services.map((s) =>
                                            s.serviceId === service.serviceId
                                                ? { ...s, selected: e.target.checked }
                                                : s
                                        );
                                        setServices(updatedServices);
                                    }}
                                />
                                {service.serviceName} ({service.servicePrice} VND)
                            </label>
                        ))
                    ) : (
                        <p>No available services</p>
                    )}
                </div>

                {/* User Points Discount */}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={useUserPoints}
                            onChange={() => setUseUserPoints(!useUserPoints)}
                        />{' '}
                        Use {userPoints} Points for Discount
                    </label>
                </div>

                {/* Total Price */}
                <h3>Total Price: {isNaN(totalPrice) ? 'Calculating...' : `${totalPrice} VND`}</h3>

                <button onClick={handleNavigateToPayment}>Proceed to Payment</button>
            </div>
        );
    }

    export default Booking;