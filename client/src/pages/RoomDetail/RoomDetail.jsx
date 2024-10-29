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

  const handleNavigateToPayment = (e) => {
    e.preventDefault();
    if (!userId) {
      setError('You must be logged in to book a room.');
      navigate('/login'); // Redirect to login if not logged in
      return;
    }

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

    setError(''); // Clear error if all checks pass

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
        <div className="relative w-full lg:w-2/3 mx-auto">
          {/* Main image display with a horizontal frame */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <img
              src={room?.images[currentImageIndex]}
              alt={`${room?.roomName} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Left navigation button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right navigation button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail navigation below the main image */}
          <div className="flex justify-center space-x-4 mt-4">
            {room?.images.map((_, index) => (
              <img
                key={index}
                src={room.images[index]}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${index === currentImageIndex ? "border-2 border-blue-500" : "border border-transparent"}`}
              />
            ))}
          </div>
          {/* Horizontal divider line */}
          <div className="mt-4 border-t border-gray-500 w-full"></div>
          <div className="mt-6">
            {/* Title for Room Description */}
            <h2 className="text-2xl font-semibold text-gray-800 text-left mb-2">Room Description</h2>
            <p className="text-base text-gray-600 mb-6 text-left">{room?.roomDetailsDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-400 mr-2" />
              <span>Type: {room?.roomType}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-gray-400 mr-2" />
              <span>
                Available hours: 9:00AM - 5:00 PM
              </span>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-left mb-2">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Airplay className="w-5 h-5 text-gray-500 mr-2" />
                <span>Lighting:Adjustable lighting </span>
              </div>
              <div className="flex items-center">
                <Music className="w-5 h-5 text-gray-500 mr-2" />
                <span>Sound System:Easy to install, it replaces low quality on-board audio with high quality connectivity options. </span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-gray-500 mr-2" />
                <span>Power Outlets: International standard power socket </span>
              </div>
              <div className="flex items-center">
                <Droplet className="w-5 h-5 text-gray-500 mr-2" />
                <span>Water Dispenser:Three water spouts hot, room temperature, cold </span>
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 lg:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{room?.roomName}</h1>
            <div className="bg-green-500 text-white px-4 py-1 rounded-full font-semibold">
              {room?.roomStatus}
            </div>
          </div>


          <form onSubmit={handleNavigateToPayment} className="bg-gray-50 p-2 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Book the Room</h2>



            {/* Booking Type Radio Buttons */}
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="slot"
                  checked={bookingType === 'slot'}
                  onChange={handleBookingTypeChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Book by Slot</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="range"
                  checked={bookingType === 'range'}
                  onChange={handleBookingTypeChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Book by Date Range</span>
              </label>
            </div>

            {/* Display error message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Booking by Slot */}
            {bookingType === 'slot' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800 text-center">Available Slots</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateSelection}
                  min={new Date().toISOString().split('T')[0]}
                  className="border border-gray-300 p-2 rounded-md mb-4"
                />
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.slotId}
                        className={`p-4 rounded-lg border transition-all duration-200 ease-in-out ${selectedSlots.some(s => s.slotId === slot.slotId)
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:bg-gray-100 shadow-sm'
                          }`}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedSlots.some(s => s.slotId === slot.slotId)}
                              onChange={() => handleSlotSelection(slot)}
                              className="sr-only" // Hide default checkbox
                            />
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ease-in-out ${selectedSlots.some(s => s.slotId === slot.slotId)
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-gray-200 border-gray-300'
                                }`}
                            >
                              {selectedSlots.some(s => s.slotId === slot.slotId) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-gray-800 font-medium">{slot.slotStartTime} - {slot.slotEndTime}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No available slots</p>
                )}
              </div>
            )}


            {/* Booking by Date Range */}
            {bookingType === 'range' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Select Date Range</h3>
                <div className="space-y-2">
                  <label className="block text-gray-700">
                    Start Date:
                    <input
                      type="date"
                      name="start"
                      value={dateRange.start}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="border border-gray-300 p-2 rounded-md mt-1"
                    />
                  </label>
                  <label className="block text-gray-700">
                    End Date:
                    <input
                      type="date"
                      name="end"
                      value={dateRange.end}
                      onChange={handleDateChange}
                      min={dateRange.start || new Date().toISOString().split('T')[0]}
                      className="border border-gray-300 p-2 rounded-md mt-1"
                    />
                  </label>
                </div>
                {isRoomAvailable !== null && (
                  <p className={`mt-4 ${isRoomAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isRoomAvailable
                      ? "Room is available for the selected dates."
                      : "Room is not available for the selected dates. Please choose different dates."}
                  </p>
                )}
              </div>
            )}

            {/* Available Services Section */}
            <div className="p-4 bg-white shadow-lg rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Services</h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.serviceId}
                      onClick={() => {
                        const updatedServices = services.map((s) =>
                          s.serviceId === service.serviceId
                            ? { ...s, selected: !s.selected }
                            : s
                        );
                        setServices(updatedServices);
                      }}
                      className={`cursor-pointer border-2 rounded-md px-4 py-2 text-center transition-colors ${service.selected
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-gray-300 text-gray-800 bg-white'
                        }`}
                    >
                      {service.serviceName} (₫{service.servicePrice.toLocaleString()})
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No available services</p>
              )}
            </div>

            {/* User Points Discount */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
              <label className="flex items-center cursor-pointer space-x-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useUserPoints}
                    onChange={() => setUseUserPoints(!useUserPoints)}
                    className="sr-only" // Hide default checkbox
                  />
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ease-in-out ${useUserPoints ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'
                      }`}
                  >
                    {useUserPoints && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-800 font-medium">
                  Use {userPoints} Points for Discount
                </span>
              </label>
            </div>

            {/* Total Price Section */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-red-500 text-2xl font-bold">Total: ₫{totalPrice.toLocaleString()}</p>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                (bookingType === 'slot' && !selectedDate) ||
                (bookingType === 'range' && (!dateRange.start || !dateRange.end))
              }
              className={`w-full py-2 px-4 rounded-md transition duration-300 ${(bookingType === 'slot' && !selectedDate) ||
                (bookingType === 'range' && (!dateRange.start || !dateRange.end))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              Book the Room
            </button>
          </form>

        </div>
      </div>



      {/* Location Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-left mb-2">Location</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-xl text-black mb-2 " />
            <p className="text-base text-black mr-2 mt-4">Công viên Phần mềm Quang Trung, Số 10, Lô 26, Đường số 3, Phường Tân Chánh Hiệp, Quận 12, TP. Hồ Chí Minh</p>
          </div>
          <div style={{ position: 'relative', paddingBottom: '30%', height: 0, overflow: 'hidden', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.939240793746!2d106.62014161533469!3d10.870047560392325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b1e7e3456ab%3A0x4e7b4d73a5f6f8d2!2sQTSC%20Building%201!5e0!3m2!1sen!2s!4v1635780245389!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0, border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>


      <RoomListDetail />
    </div>
  );
}
