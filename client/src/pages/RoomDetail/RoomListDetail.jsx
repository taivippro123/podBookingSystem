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
  }
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
                <span>Capacity: {room.capacity}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Available: {room.availableFrom} - {room.availableTo}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Price: {room.price}k/hour</span>
              </div>
              <Link to={'/room/123'} className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
