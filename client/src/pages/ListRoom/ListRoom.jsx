import React, { useState } from "react";
import {
  Search,
  Users,
  DollarSign,
  Monitor,
  Coffee,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const rooms = [
  {
    id: 1,
    name: "Meeting Room 1",
    capacity: 10,
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    price: 50,
    equipment: ["Projector", "Whiteboard"],
    type: "Conference",
    image: "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  },
  {
    id: 2,
    name: "Meeting Room 2",
    capacity: 10,
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    price: 50,
    equipment: ["TV", "Whiteboard"],
    type: "Conference",
    image: "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  },
  {
    id: 3,
    name: "Meeting Room 3",
    capacity: 10,
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    price: 60,
    equipment: ["Projector", "Video conferencing"],
    type: "Conference",
    image: "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  },
  {
    id: 4,
    name: "Meeting Room 4",
    capacity: 10,
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    price: 55,
    equipment: ["TV", "Video conferencing"],
    type: "Conference",
    image: "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  },
  {
    id: 5,
    name: "Meeting Room 5",
    capacity: 10,
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    price: 65,
    equipment: ["Projector", "Whiteboard", "Video conferencing"],
    type: "Conference",
    image: "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  },
  {
    id: 6,
    name: "Meeting Room 6",
    capacity: 10,
    availableFrom: "9:00 AM",
    availableTo: "5:00 PM",
    price: 70,
    equipment: ["TV", "Whiteboard", "Video conferencing"],
    type: "Conference",
    image: "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
  },
];

export default function ListRoom() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
    equipment: "",
    type: "",
  });
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filtered = rooms.filter((room) => {
      return (
        room.name.toLowerCase().includes(searchParams.name.toLowerCase()) &&
        (searchParams.minPrice === "" ||
          room.price >= parseInt(searchParams.minPrice)) &&
        (searchParams.maxPrice === "" ||
          room.price <= parseInt(searchParams.maxPrice)) &&
        (searchParams.capacity === "" ||
          room.capacity >= parseInt(searchParams.capacity)) &&
        (searchParams.equipment === "" ||
          room.equipment.includes(searchParams.equipment)) &&
        (searchParams.type === "" || room.type === searchParams.type)
      );
    });
    setFilteredRooms(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Tìm kiếm phòng họp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên phòng
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={searchParams.name}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-md"
                placeholder="Nhập tên phòng"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Khoảng giá
            </label>
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-400" />
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={searchParams.minPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Từ"
              />
              <span>-</span>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Đến"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số lượng người
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={searchParams.capacity}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-md"
                placeholder="Số người tối thiểu"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="equipment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Thiết bị
            </label>
            <div className="relative">
              <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="equipment"
                name="equipment"
                value={searchParams.equipment}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-md appearance-none"
              >
                <option value="">Tất cả thiết bị</option>
                <option value="Projector">Máy chiếu</option>
                <option value="TV">TV</option>
                <option value="Whiteboard">Bảng trắng</option>
                <option value="Video conferencing">
                  Hệ thống hội nghị truyền hình
                </option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại phòng
            </label>
            <div className="relative">
              <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="type"
                name="type"
                value={searchParams.type}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-md appearance-none"
              >
                <option value="">Tất cả loại phòng</option>
                <option value="Conference">Phòng họp</option>
                <option value="Training">Phòng đào tạo</option>
                <option value="Board">Phòng hội đồng</option>
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-slate-800 transition duration-300"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={room.image}
                alt={room.name}
                layout="fill"
                className="relative h-48 w-full object-cover"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="w-4 h-4 mr-1" />
                <span>Sức chứa: {room.capacity}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Có sẵn: {room.availableFrom} - {room.availableTo}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Giá: {room.price}k/giờ</span>
              </div>
              <Link to={'/room/123'} className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
                Đặt ngay
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
