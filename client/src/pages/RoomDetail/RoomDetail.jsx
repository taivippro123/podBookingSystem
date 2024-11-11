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
  ParkingCircle,
  ConciergeBell,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentModal from "./PaymentModal"; // Import the PaymentModal component
import RoomListDetail from "./RoomListDetail";
import { Image, Modal } from "antd";

export default function RoomDetail() {
  const [userId, setUserId] = useState(null);
  const { id } = useParams(); // Get roomId from the URL
  const [bookingType, setBookingType] = useState("slot"); // 'slot' or 'range'
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [services, setServices] = useState([]);
  const [useUserPoints, setUseUserPoints] = useState(false);
  const [roomDetail, setRoomDetail] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isRoomAvailable, setIsRoomAvailable] = useState(null);
  const [userPoints, setUserPoints] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [originalUserPoints, setOriginalUserPoints] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const [isSlotModalVisible, setIsSlotModalVisible] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserId(userData.userId);
    }
    console.log(
      "Current userId in localStorage:",
      userData ? userData.userId : null
    );
    // Fetch room details
    fetch(`http://localhost:5000/room-details/${id}`)
      .then((res) => res.json())
      .then((data) => setRoomDetail(data));

    // Fetch available slots
    if (bookingType === "slot") {
      const today = new Date().toISOString().split("T")[0];
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
        console.log("Available slots:", data);

        // Lấy giờ hiện tại
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Kiểm tra nếu ngày được chọn là hôm nay
        const isToday = date === now.toISOString().split("T")[0];

        // Cập nhật trạng thái slot nếu ngày được chọn là hôm nay
        const updatedSlots = data.map((slot) => {
          const [startHour, startMinute] = slot.slotStartTime.split(":").map(Number);
          const isExpired =
            isToday && (startHour < currentHour || (startHour === currentHour && startMinute <= currentMinute));

          // Thêm thuộc tính isExpired vào mỗi slot
          return { ...slot, isExpired };
        });

        setAvailableSlots(updatedSlots);
      })
      .catch((error) => console.error("Error fetching available slots:", error));
  };




  const fetchServices = () => {
    fetch("http://localhost:5000/services")
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw services data:", data);
        const formattedServices = data.map((service) => ({
          ...service,
          servicePrice: Number(service.servicePrice),
        }));
        console.log("Formatted services:", formattedServices);
        setServices(formattedServices);
      })
      .catch((error) => console.error("Error fetching services:", error));
  };

  const fetchUserPoints = () => {
    const userData = JSON.parse(localStorage.getItem("user")); // Retrieve the user data
    const userId = userData ? userData.userId : null; // Safely access userId
    console.log("Fetching user points for userId:", userId);

    if (userId) {
      fetch(`http://localhost:5000/user-points/${userId}`)
        .then((res) => {
          console.log("Response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Raw user points data:", data);
          if (data && data.userPoint !== undefined) {
            setUserPoints(Number(data.userPoint)); // Set user points from the API response
            setOriginalUserPoints(Number(data.userPoint)); // Set original points
            console.log("Set user points to:", Number(data.userPoint));
          } else {
            console.error("Invalid user points data:", data);
            setUserPoints(0); // Default to 0 if data is invalid
            setOriginalUserPoints(0); // Set original points to 0 if invalid data
          }
        })
        .catch((error) => {
          console.error("Error fetching user points:", error);
          setUserPoints(0); // Default to 0 in case of error
          setOriginalUserPoints(0); // Set original points to 0 in case of error
        });
    } else {
      console.error("No userId found in localStorage");
      setUserPoints(0); // Default to 0 if no userId is found
      setOriginalUserPoints(0); // Set original points to 0 if no userId
    }
  };

  // Fetch user points on component mount
  useEffect(() => {
    fetchUserPoints();
  }, []);

  const handleBookingTypeChange = (e) => {
    setBookingType(e.target.value);
    setSelectedSlots([]);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let newDateRange = { ...dateRange, [name]: value };

    if (name === "start") {
      // If changing start date, ensure end date is not before start date
      if (newDateRange.end && new Date(value) > new Date(newDateRange.end)) {
        newDateRange.end = value;
      }
    } else if (name === "end") {
      // If changing end date, ensure it's not before start date
      if (
        newDateRange.start &&
        new Date(value) < new Date(newDateRange.start)
      ) {
        return; // Don't update if end date is before start date
      }
    }

    setDateRange(newDateRange);
  };

  
  const handleSlotSelection = (slot) => {
    setSelectedSlots((prevSelectedSlots) => {
      if (prevSelectedSlots.some((s) => s.slotId === slot.slotId)) {
        return prevSelectedSlots.filter((s) => s.slotId !== slot.slotId);
      } else {
        return [...prevSelectedSlots, slot];
      }
    });
  };
  // Hàm format thời gian chỉ lấy giờ và phút
  const formatTime = (timeString) => {
    // Kiểm tra nếu thời gian là chuỗi hợp lệ
    if (!timeString) return "";
    // Cắt chuỗi thời gian lấy giờ và phút (HH:mm)
    return timeString.substring(0, 5);
  };

  const calculateDaysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
  };

  const calculateTotalPrice = () => {
    if (!roomDetail) {
      console.log("Room details not loaded yet");
      return;
    }

    let price = 0;
    if (bookingType === "slot") {
      price = selectedSlots.length * (roomDetail?.roomPricePerSlot || 0);
    } else if (bookingType === "range") {
      const days = calculateDaysBetween(dateRange.start, dateRange.end);
      const weeksCount = Math.floor(days / 7);
      const remainingDays = days % 7;

      if (days < 7) {
        price = days * (roomDetail?.roomPricePerDay || 0);
      } else {
        price =
          weeksCount * (roomDetail?.roomPricePerWeek || 0) +
          remainingDays * (roomDetail?.roomPricePerDay || 0);
      }
    }

    const selectedServicePrice = services.reduce((sum, service) => {
      return service.selected ? sum + (Number(service.servicePrice) || 0) : sum;
    }, 0);

    let discountAmount = 0;
    if (useUserPoints) {
      discountAmount = Math.min(userPoints, price + selectedServicePrice);
    }

    const discount = discountAmount;
    setDiscount(discount);

    // Set the total price with the discount applied
    const finalPrice = price + selectedServicePrice - discount;
    setTotalPrice(finalPrice);

    // Update user points based on the discount
    if (useUserPoints) {
      const remainingPoints = userPoints - discount;
      setUserPoints(remainingPoints);
    } else {
      setUserPoints(originalUserPoints);
    }

    // Set the discount state so it can be passed to the modal
    setDiscount(discount);
  };

  // Handle switch toggle (use points or not)
  const handleUsePointsChange = () => {
    setUseUserPoints(!useUserPoints);
    calculateTotalPrice(); // Recalculate the price when the switch is toggled
  };



  useEffect(() => {
    if (roomDetail) {
      calculateTotalPrice();
    }
  }, [
    roomDetail,
    bookingType,
    useUserPoints,
    services,
    selectedSlots,
    dateRange,
  ]);

  const checkRoomAvailability = () => {
    if (dateRange.start && dateRange.end) {
      fetch(
        `http://localhost:5000/available-rooms/${id}?startDate=${dateRange.start}&endDate=${dateRange.end}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Room availability:", data);
          setIsRoomAvailable(data.available);
        })
        .catch((error) =>
          console.error("Error checking room availability:", error)
        );
    }
  };

  useEffect(() => {
    if (bookingType !== "slot" && dateRange.start && dateRange.end) {
      checkRoomAvailability();
    }
  }, [bookingType, dateRange]);

  useEffect(() => {
    console.log("userPoints updated:", userPoints);
  }, [userPoints]);

  const handleDateSelection = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    fetchAvailableSlots(selectedDate);

    // Lấy ngày và giờ hiện tại
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Nếu người dùng chọn ngày hôm nay, kiểm tra các slot đã chọn
    if (selectedDate === currentDate) {
      const updatedSelectedSlots = selectedSlots.filter((slot) => {
        const [startHour, startMinute] = slot.slotStartTime.split(":").map(Number);
        // Giữ lại các slot mà giờ bắt đầu chưa quá giờ hiện tại
        return startHour > currentHour || (startHour === currentHour && startMinute > currentMinute);
      });

      // Cập nhật danh sách các slot đã chọn
      setSelectedSlots(updatedSelectedSlots);

      // Thông báo nếu có slot đã bị loại bỏ do quá giờ
      if (updatedSelectedSlots.length < selectedSlots.length) {
        console.log("Một số slot đã quá giờ và bị loại bỏ.");
      }
    }
  };



  const handleNavigateToPayment = (e) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to book a room.");
      navigate("/login"); // Redirect to login if not logged in
      return;
    }

    let bookingStartDay, bookingEndDay;

    if (bookingType === "slot") {
      if (!selectedDate) {
        setError("Please select a date.");
        return;
      }
      if (selectedSlots.length === 0) {
        setError("Please select at least one time slot.");
        return;
      }
      bookingStartDay = selectedDate;
      bookingEndDay = selectedDate;
    } else if (bookingType === "range") {
      if (!dateRange.start || !dateRange.end) {
        setError("Please select both start and end dates.");
        return;
      }
      if (!isRoomAvailable) {
        setError("The room is not available for the selected dates.");
        return;
      }
      bookingStartDay = dateRange.start;
      bookingEndDay = dateRange.end;
    }

    setError(""); // Clear error if all checks pass

    // Collect selected services
    const selectedServices = services.filter((service) => service.selected);

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
      userId,
    };
    navigate("/payment", { state: paymentData });
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

  //modelPayment
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Controls modal visibility
  const [paymentData, setPaymentData] = useState(null); // Holds booking data for the modal
  const handleOpenPaymentModal = (e) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to book a room.");
      navigate("/login");
      return;
    }

    let bookingStartDay, bookingEndDay;
    if (bookingType === "slot") {
      if (!selectedDate || selectedSlots.length === 0) {
        setError("Please select a date and at least one time slot.");
        return;
      }
      bookingStartDay = selectedDate;
      bookingEndDay = selectedDate;
    } else if (bookingType === "range") {
      if (!dateRange.start || !dateRange.end || !isRoomAvailable) {
        setError("Please select valid dates and ensure room availability.");
        return;
      }
      bookingStartDay = dateRange.start;
      bookingEndDay = dateRange.end;
    }

    setError("");

    const paymentDetails = {
      roomId: id,
      roomName: roomDetail.roomName,
      totalPrice,
      bookingType,
      selectedServices: services.filter((s) => s.selected),
      selectedSlots,
      selectedDate,
      bookingStartDay,
      bookingEndDay,
      discount,
      userId,
    };

    setPaymentData(paymentDetails);
    setShowPaymentModal(true);
  };

  const handleSlotModalOpen = () => {
    if (!selectedDate) {
      setError("Please select a date first");
      return;
    }
    setIsSlotModalVisible(true);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-4 container mx-auto p-4">
      <div className="lg:flex justify-center mb-4">
        <div className="relative w-full lg:w-2/3 mx-auto">
          {/* Main image display with a horizontal frame */}
          <div className="relative w-full max-h-115 rounded-lg overflow-hidden">
            <Image
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
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${index === currentImageIndex
                  ? "border-2 border-blue-500"
                  : "border border-transparent"
                  }`}
              />
            ))}
          </div>
          {/* Horizontal divider line */}
          <div className="mt-4 border-t border-gray-500 w-full"></div>
          <div className="mt-6">
            {/* Title for Room Description */}
            <h2 className="text-2xl font-semibold text-gray-800 text-left mb-2">
              Room Description
            </h2>
            <p className="text-base text-gray-600 mb-6 text-left">
              {room?.roomDetailsDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-400 mr-2" />
              <span>Type: {room?.roomType}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-gray-400 mr-2" />
              <span>Open 24/7</span>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-left mb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Airplay className="w-5 h-5 text-gray-500 mr-2" />
                <span>Lighting: Adjustable lighting </span>
              </div>
              <div className="flex items-center">
                <ParkingCircle  className="w-7 h-7 text-gray-500 mr-2" />
                <span>
                Parking: Provide parking for employees and customers.
                </span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-gray-500 mr-2" />
                <span>Power Outlets: International standard power socket </span>
              </div>
              <div className="flex items-center">
                <ConciergeBell  className="w-10 h-10 text-gray-500 mr-2" />
                <span>
                Reception services: Support welcoming guests, answering phones, arranging appointments.{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {room?.roomName}
            </h1>
            <div className="bg-green-500 text-white px-4 py-1 rounded-full font-semibold">
              {room?.roomStatus}
            </div>
          </div>

          <form
            onSubmit={handleNavigateToPayment}
            className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-4 text-gray-900">Select Booking Type</h2>

            {/* Booking Type Radio Buttons */}
            <div className="flex space-x-6 mb-8">
              <label className="flex items-center space-x-3 cursor-pointer text-lg">
                <input
                  type="radio"
                  value="slot"
                  checked={bookingType === "slot"}
                  onChange={handleBookingTypeChange}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">Book by Slot</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer text-lg">
                <input
                  type="radio"
                  value="range"
                  checked={bookingType === "range"}
                  onChange={handleBookingTypeChange}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">Book by Date Range</span>
              </label>
            </div>

            {/* Display error message */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Booking by Slot */}
            {bookingType === "slot" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateSelection}
                  min={new Date().toISOString().split("T")[0]}
                  className="border border-gray-300 p-3 rounded-lg w-full mb-5 cursor-pointer"
                  onKeyDown={(e) => e.preventDefault()}
                  onClick={(e) => e.target.showPicker()}
                />
                
                <button
                  type="button"
                  onClick={handleSlotModalOpen}
                  className="w-full py-3 px-4 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                >
                  Select Time Slots ({selectedSlots.length} selected)
                </button>
                
                {selectedSlots.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Selected Slots:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSlots.map((slot) => (
                        <span key={slot.slotId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {formatTime(slot.slotStartTime)} - {formatTime(slot.slotEndTime)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Booking by Date Range */}
            {bookingType === "range" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Select Date Range</h3>
                <div className="flex space-x-4">
                  <label className="block text-gray-700 w-full">
                    Start Date:
                    <input
                      type="date"
                      name="start"
                      value={dateRange.start}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="border border-gray-300 p-3 rounded-lg w-full mt-1 cursor-pointer"
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={(e) => e.target.showPicker()}
                    />
                  </label>
                  <label className="block text-gray-700 w-full">
                    End Date:
                    <input
                      type="date"
                      name="end"
                      value={dateRange.end}
                      onChange={handleDateChange}
                      min={dateRange.start || new Date().toISOString().split("T")[0]}
                      className="border border-gray-300 p-3 rounded-lg w-full mt-1 cursor-pointer"
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={(e) => e.target.showPicker()}
                    />
                  </label>
                </div>
                {isRoomAvailable !== null && (
                  <p className={`mt-4 text-center ${isRoomAvailable ? "text-green-500" : "text-red-500"}`}>
                    {isRoomAvailable
                      ? "Room is available for the selected dates."
                      : "Room is not available for the selected dates. Please choose different dates."}
                  </p>
                )}
              </div>
            )}

            {/* Available Services Section */}
            <div className="p-4 bg-gray-50 shadow-md rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Services</h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.serviceId}
                      onClick={() => {
                        const updatedServices = services.map((s) =>
                          s.serviceId === service.serviceId ? { ...s, selected: !s.selected } : s
                        );
                        setServices(updatedServices);
                      }}
                      className={`cursor-pointer border-2 rounded-lg px-4 py-2 text-center transition-colors ${service.selected
                        ? "border-blue-500 text-blue-500 bg-blue-50"
                        : "border-gray-300 text-gray-700 bg-white"
                        }`}
                    >
                      {service.serviceName} (₫{service.servicePrice.toLocaleString("vi-VN")})
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No available services</p>
              )}
            </div>

            {/* User Points Discount */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useUserPoints}
                  onChange={() => setUseUserPoints(!useUserPoints)}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 bg-gray-800 rounded-full peer-checked:bg-blue-500 transition-colors duration-300`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${useUserPoints ? "translate-x-5" : ""
                      }`}
                  ></span>
                </div>
              </label>
              <span className="text-gray-800 font-medium">
                {useUserPoints
                  ? `You have ${userPoints} points after use`
                  : `Use ${userPoints} points for discount`}
              </span>
            </div>






            {/* Total Price Section */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-2xl font-semibold text-red-600">Total: ₫{totalPrice.toLocaleString("vi-VN")}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                (bookingType === "slot" && !selectedDate) ||
                (bookingType === "range" && (!dateRange.start || !dateRange.end))
              }
              onClick={handleOpenPaymentModal}
              className={`w-full py-3 px-4 rounded-md font-semibold transition duration-300 ${(bookingType === "slot" && !selectedDate) ||
                (bookingType === "range" && (!dateRange.start || !dateRange.end))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Book the Room
            </button>
          </form>

        </div>
      </div>
      {showPaymentModal && (
        <PaymentModal
          paymentData={paymentData}
          closeModal={() => setShowPaymentModal(false)}
        />
      )}

      {/* Location Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-left mb-2">Location</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-xl text-black mb-2 " />
            <p className="text-base text-black mr-2 mt-4">
              Công viên Phần mềm Quang Trung, Số 10, Lô 26, Đường số 3, Phường
              Tân Chánh Hiệp, Quận 12, TP. Hồ Chí Minh
            </p>
          </div>
          <div
            style={{
              position: "relative",
              paddingBottom: "30%",
              height: 0,
              overflow: "hidden",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1076.7260332166363!2d106.62678072571467!3d10.852436913084668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2s!4v1731064745995!5m2!1svi!2s" width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>

      <RoomListDetail />

      <Modal
        title="Select Time Slots"
        open={isSlotModalVisible}
        onCancel={() => setIsSlotModalVisible(false)}
        footer={[
          <button
            key="close"
            onClick={() => setIsSlotModalVisible(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Done
          </button>
        ]}
        width={800}
      >
        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableSlots.map((slot) => {
              const canSelectSlot = !selectedDate || !slot.isExpired;

              return (
                <div
                  key={slot.slotId}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ease-in-out ${
                    selectedSlots.some((s) => s.slotId === slot.slotId)
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : slot.isExpired && selectedDate
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSlots.some((s) => s.slotId === slot.slotId)}
                      onChange={() => handleSlotSelection(slot)}
                      disabled={!canSelectSlot}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedSlots.some((s) => s.slotId === slot.slotId)
                          ? "bg-blue-500 border-blue-500"
                          : "bg-gray-200 border-gray-300"
                      }`}
                    >
                      {selectedSlots.some((s) => s.slotId === slot.slotId) && (
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
                    <span className="text-gray-700 font-medium">
                      {formatTime(slot.slotStartTime)} - {formatTime(slot.slotEndTime)}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No available slots</p>
        )}
      </Modal>
    </div>
  );
}
