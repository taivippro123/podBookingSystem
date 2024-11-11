import React, { useState, useEffect } from "react";
import { Users, DollarSign, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(0);

  const roomsPerPage = 3;

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/available-rooms');
      setRooms(response.data);
      setFilteredRooms(response.data);
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
        (searchParams.minPrice === "" ||
          room.pricePerHour >= parseInt(searchParams.minPrice)) &&
        (searchParams.maxPrice === "" ||
          room.pricePerHour <= parseInt(searchParams.maxPrice)) &&
        (searchParams.capacity === "" ||
          room.capacity >= parseInt(searchParams.capacity)) &&
        (searchParams.equipment === "" ||
          room.equipment.includes(searchParams.equipment)) &&
        (searchParams.type === "" || room.roomType === searchParams.type)
      );
    });
    setFilteredRooms(filtered);
    setCurrentPage(0);
  };

  const paginatedRooms = filteredRooms.slice(
    currentPage * roomsPerPage,
    currentPage * roomsPerPage + roomsPerPage
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * roomsPerPage < filteredRooms.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRooms.map((room) => (
          <div
            key={room.roomId}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="relative h-48">
              {room.imageUrls && room.imageUrls.length > 0 ? (
                <img
                  src={room.imageUrls[0]}
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
                <span>
                Available hours: Open 24/7
                </span>
              </div>
              <div className="flex items-center text-red-500 mb-4">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>Price: {(Number(room.roomPricePerSlot)).toLocaleString('vi-VN')} ₫/Slot </span>
              </div>
              <Link to={`/room/${room.roomId}`} className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className={`flex items-center py-2 px-4 rounded ${currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 transition duration-300'}`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * roomsPerPage >= filteredRooms.length}
          className={`flex items-center py-2 px-4 rounded ${(currentPage + 1) * roomsPerPage >= filteredRooms.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 transition duration-300'}`}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
