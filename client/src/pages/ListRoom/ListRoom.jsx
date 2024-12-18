import React, { useState, useEffect } from "react";
import { Search, Users, DollarSign, Monitor, Coffee, Clock } from "lucide-react";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function ListRoom() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
    equipment: "",
    type: "",
  });

  const [filteredRooms, setFilteredRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]); // New state for unique room types

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/available-rooms');
      const fetchedRooms = response.data;
      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);
      
      // Extract unique room types
      const uniqueTypes = [...new Set(fetchedRooms.map((room) => room.roomType))];
      setRoomTypes(uniqueTypes);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filtered = rooms.filter((room) => {
      return (
        room.roomName.toLowerCase().includes(searchParams.name.toLowerCase()) &&
        (searchParams.minPrice === "" || room.roomPricePerSlot >= parseInt(searchParams.minPrice)) &&
        (searchParams.maxPrice === "" || room.roomPricePerSlot <= parseInt(searchParams.maxPrice)) &&
        (searchParams.capacity === "" || room.capacity >= parseInt(searchParams.capacity)) &&
        (searchParams.equipment === "" || room.equipment.includes(searchParams.equipment)) &&
        (searchParams.type === "" || room.roomType === searchParams.type)
      );
    });
    setFilteredRooms(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Search Meeting Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={searchParams.roomName}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-md"
                placeholder="Enter room name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-400" />
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={searchParams.minPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="From"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={searchParams.maxPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="To"
                min="0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <div className="relative">
              <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="type"
                name="type"
                value={searchParams.type}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-md appearance-none"
              >
                <option value="">All types</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-slate-800 transition duration-300"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.roomId} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative h-48">
              {room.imageUrls && room.imageUrls.length > 0 ? (
                <img
                  src={room.imageUrls[0]} // Display the first image
                  alt={room.roomName}
                  className="relative h-48 w-full object-cover"
                />
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{room.roomName}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="w-4 h-4 mr-1" />
                <span>Type: {room.roomType}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>Available hours: Open 24/7</span>
              </div>
              <div className="flex items-center text-red-500 mb-4">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Price: {(Number(room.roomPricePerSlot)).toLocaleString('vi-VN')} ₫/Slot</span>
              </div>

              <Link to={`/room/${room.roomId}`} className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
