import React, { useState } from "react";
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
  ThumbsUp,
  ThumbsDown,
  Airplay,
  Music,
  Zap,
  Droplet,
} from "lucide-react";

const room = {
  id: 1,
  name: "Phòng họp Sao Mai",
  capacity: 10,
  size: 30, // in square meters
  availableFrom: "9:00 AM",
  availableTo: "5:00 PM",
  price: 50,
  rating: 4.5,
  equipment: [
    "Máy chiếu",
    "Bảng trắng",
    "Hệ thống hội nghị truyền hình",
    "Wifi tốc độ cao",
  ],
  type: "Phòng họp",
  description:
    "Phòng họp Sao Mai là không gian lý tưởng cho các cuộc họp và hội thảo chuyên nghiệp. Với thiết kế hiện đại và đầy đủ tiện nghi, phòng họp này đảm bảo mọi nhu cầu của bạn đều được đáp ứng.",
  images: [
    "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-1.png",
    "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-2.png",
    "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  ],
  amenities: ["Điều hòa", "Nước uống miễn phí", "Bãi đậu xe", "Bảo mật 24/7"],
  reviews: [
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Phòng họp tuyệt vời, đầy đủ tiện nghi và rất chuyên nghiệp.",
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      comment:
        "Không gian thoáng đãng, thiết bị hiện đại. Chỉ thiếu chút âm thanh.",
    },
    {
      id: 3,
      user: "Lê Văn C",
      rating: 5,
      comment: "Dịch vụ xuất sắc, nhân viên hỗ trợ nhiệt tình.",
    },
  ],
  location: {
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69766797486745!3d10.775777989376853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf6e18e!2zMTIzIEzDqiBM4bujaSwgQuG6v24gTmdow6ksIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1686565833736!5m2!1svi!2s",
  },
  additionalInfo: {
    lighting: "Đèn LED điều chỉnh độ sáng",
    soundSystem: "Hệ thống âm thanh vòm 5.1",
    powerOutlets: "Nhiều ổ cắm điện trên bàn và tường",
    waterDispenser: "Máy lọc nước nóng lạnh",
  },
};

export default function RoomDetail() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // Handle booking logic here
    console.log("Booking submitted", { selectedDate, selectedTimeSlot });
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={room.images[currentImageIndex]}
            alt={`${room.name} - Image ${currentImageIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="relative h-96 w-full object-cover"
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
            {room.images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
            <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span>{room.rating}/5</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{room.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-400 mr-2" />
              <span>Sức chứa: {room.capacity} người</span>
            </div>
            <div className="flex items-center">
              <Maximize className="w-6 h-6 text-gray-400 mr-2" />
              <span>Diện tích: {room.size} m²</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-gray-400 mr-2" />
              <span>
                Giờ hoạt động: {room.availableFrom} - {room.availableTo}
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-gray-400 mr-2" />
              <span>Giá: {room.price}k/giờ</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Trang thiết bị</h2>
            <div className="grid grid-cols-2 gap-2">
              {room.equipment.map((item, index) => (
                <div key={index} className="flex items-center">
                  {item.includes("Wifi") && (
                    <Wifi className="w-5 h-5 text-blue-500 mr-2" />
                  )}
                  {item.includes("chiếu") && (
                    <Monitor className="w-5 h-5 text-blue-500 mr-2" />
                  )}
                  {item.includes("hội nghị") && (
                    <Video className="w-5 h-5 text-blue-500 mr-2" />
                  )}
                  {item.includes("Bảng") && (
                    <Coffee className="w-5 h-5 text-blue-500 mr-2" />
                  )}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tiện nghi khác</h2>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleBooking}
            className="bg-gray-50 p-6 rounded-lg mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Đặt phòng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chọn ngày
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="pl-10 w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="time-slot"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chọn khung giờ
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    id="time-slot"
                    name="time-slot"
                    value={selectedTimeSlot}
                    onChange={handleTimeSlotChange}
                    className="pl-10 w-full p-2 border rounded-md appearance-none"
                    required
                  >
                    <option value="">Chọn khung giờ</option>
                    <option value="09:00-10:00">09:00 - 10:00</option>
                    <option value="10:00-11:00">10:00 - 11:00</option>
                    <option value="11:00-12:00">11:00 - 12:00</option>
                    <option value="13:00-14:00">13:00 - 14:00</option>
                    <option value="14:00-15:00">14:00 - 15:00</option>
                    <option value="15:00-16:00">15:00 - 16:00</option>
                    <option value="16:00-17:00">16:00 - 17:00</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Đặt phòng
            </button>
          </form>

          {/* New sections start here */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Thông tin bổ sung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Airplay className="w-5 h-5 text-gray-500 mr-2" />
                <span>Ánh sáng: {room.additionalInfo.lighting}</span>
              </div>
              <div className="flex items-center">
                <Music className="w-5 h-5 text-gray-500 mr-2" />
                <span>Âm thanh: {room.additionalInfo.soundSystem}</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-gray-500 mr-2" />
                <span>Ổ cắm điện: {room.additionalInfo.powerOutlets}</span>
              </div>
              <div className="flex items-center">
                <Droplet className="w-5 h-5 text-gray-500 mr-2" />
                <span>Nước uống: {room.additionalInfo.waterDispenser}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Đánh giá</h2>
            {room.reviews.map((review) => (
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
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Vị trí</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span>{room.location.address}</span>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={room.location.mapUrl}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
