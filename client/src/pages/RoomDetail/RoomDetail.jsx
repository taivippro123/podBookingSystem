import React, { useState, useEffect } from "react";
import {
  Users,
  Clock,
  DollarSign,
  Wifi,
  Monitor,
  Video,
  Coffee,
  Maximize,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Airplay,
  Music,
  Zap,
  Droplet,
} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';

import RoomListDetail from "./RoomListDetail";

export default function RoomDetail() {
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const room = roomDetail;
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === roomDetail?.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? roomDetail?.images.length - 1 : prevIndex - 1
    );
  };


  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-4 container mx-auto p-4">
      <div className="lg:flex justify-center mb-4">
        <div className="relative h-auto lg:w-1/2">
          <img
            src={room?.images[currentImageIndex]}
            alt={`${room?.roomName} - Image ${currentImageIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="relative h-full w-full object-cover rounded-lg "
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {room?.images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>
        <div className="p-6 lg:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{room?.roomName}</h1>
            <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span>/5</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{room?.roomDetailsDescription}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-400 mr-2" />
              <span>Capacity:  people</span>
            </div>
            <div className="flex items-center">
              <Maximize className="w-6 h-6 text-gray-400 mr-2" />
              <span>Size:  m²</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-gray-400 mr-2" />
              <span>
                Available hours:
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-gray-400 mr-2" />
              <span>Price: {room?.roomPricePerSlot} VND/Slot</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Equipment</h2>
            {/* <div className="grid grid-cols-2 gap-2">
              {room?.equipment.map((item, index) => (
                <div key={index} className="flex items-center">
                  {item.includes("Wifi") && <Wifi className="w-5 h-5 text-blue-500 mr-2" />}
                  {item.includes("Projector") && <Monitor className="w-5 h-5 text-blue-500 mr-2" />}
                  {item.includes("Video conferencing") && <Video className="w-5 h-5 text-blue-500 mr-2" />}
                  {item.includes("Whiteboard") && <Coffee className="w-5 h-5 text-blue-500 mr-2" />}
                  <span>{item}</span>
                </div>
              ))}
            </div> */}
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Additional Amenities</h2>
            {/* <div className="flex flex-wrap gap-2">
              {room?.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div> */}
          </div>
          <form onSubmit={handleNavigateToPayment} className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Book the Room</h2>
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
                Book by Date Range
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

            <div>
              <h2 className="text-xl font-semibold mb-4">Available Services</h2>
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
            <div>
              {/* Display Total Price with original price and discount */}
              <h3>
                Total Price: <span style={{ color: 'red' }}>₫{totalPrice.toLocaleString()}</span>&nbsp;


              </h3>

            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Book the Room
            </button>
          </form>
        </div>
      </div>

      <h3>Additional Information Section</h3>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Airplay className="w-5 h-5 text-gray-500 mr-2" />
            <span>Lighting: </span>
          </div>
          <div className="flex items-center">
            <Music className="w-5 h-5 text-gray-500 mr-2" />
            <span>Sound System: </span>
          </div>
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-gray-500 mr-2" />
            <span>Power Outlets: </span>
          </div>
          <div className="flex items-center">
            <Droplet className="w-5 h-5 text-gray-500 mr-2" />
            <span>Water Dispenser: </span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        {/* {room?.reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{review.user}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))} */}

      </div>

      {/* Location Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        {/* <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <span>{room?.location?.address}</span>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={room?.location?.mapUrl}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div> */}
      </div>

      <RoomListDetail />
    </div>
  );
}
