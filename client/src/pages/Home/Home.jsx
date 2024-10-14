import React, { useState, useRef } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPinIcon,
  SearchIcon,
  Star,
  UsersIcon,
} from "lucide-react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import Home2 from "./Home2";
import WorkspaceComparison from "./WorkspaceComparison";

const CARD_WIDTH = 280; // Fixed width for each card
const CARD_GAP = 16; // Gap between cards

export default function Home() {
  const [dataImg, setDataImg] = useState([
    {
      img: "https://www.kientrucdoorway.com.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-hop.jpg",
    },
    {
      img: "https://kientrucanviet.com/wp-content/uploads/2020/12/thi%E1%BA%BFt-k%E1%BA%BF-n%E1%BB%99i-th%E1%BA%A5t-ph%C3%B2ng-h%E1%BB%8Dp-xanh.jpg",
    },
    {
      img: "https://cdn-static.wework.com/content/images/home/hero-banner_1920x576.webp",
    },
  ]);

  return (
    <>
      <main className="flex-grow">
        <section className="bg-gray-100 py-2">
          <div className="container mx-auto px-4">
            {/* <div className="relative min-h-screen">
              
              <div className="absolute inset-0 z-0">
                <img
                  src="https://baoantelecom.com/upload/images/Tin%20t%E1%BB%A9c/mau-mo-hinh-va-giai-phap-phong-hop-thong-minh-01.jpg"
                  alt="Modern office space"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-40"></div>
              </div>

              
              <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center mb-6">
                  Working environment improves quality of life
                </h1>

                <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
                  <p className="text-gray-700 text-center mb-4">
                    Do it your way, we've got you covered.
                  </p>
                  <p className="text-sm text-gray-500 text-center mb-6">
                    From ready-to-use offices to shared office space, meeting
                    rooms and technology, discover workspace solutions for every
                    team.
                  </p>

                  <form className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        <option value="">Select location</option>
                        <option value="new-york">New York</option>
                        <option value="london">London</option>
                        <option value="tokyo">Tokyo</option>
                      </select>
                    </div>
                    <div className="flex-1 relative">
                      <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        <option value="">Select workspace type</option>
                        <option value="private-office">Private Office</option>
                        <option value="coworking">Coworking Space</option>
                        <option value="meeting-room">Meeting Room</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    >
                      <SearchIcon className="w-5 h-5 mr-2" />
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div> */}
            <div className=" h-[50vh] mt-10 ">
              <Carousel autoplay arrows={true} infinite={false}>
                {dataImg.map((value, index) => (
                  <div className="flex justify-center items-center" key={index}>
                    <img
                      className="object-cover h-[50vh] w-screen"
                      alt={index}
                      src={value.img}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="mt-2">
              <Home2 />
            </div>
            <div className="mt-2">
              <WorkspaceComparison />
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://thietkenoithatatz.com/wp-content/uploads/2022/04/mau-thiet-ke-phong-hop-dep.jpg"
                  alt="Conference Room"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Book a Room</h3>
                  <p className="text-gray-600 mb-4">
                    Browse our selection of meeting rooms and find the perfect
                    space for your needs.
                  </p>
                  <Link
                    to="/rooms"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                  >
                    <CalendarIcon className="mr-2" />
                    Book Now
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://thietkevanphong.pro/wp-content/uploads/2020/02/vtc-phong-hop-lon.jpg"
                  alt="Team Meeting"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    View Your Bookings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Check your upcoming reservations and manage your bookings.
                  </p>
                  <Link
                    to="/bookings"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                  >
                    <UsersIcon className="mr-2" />
                    My Bookings
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://www.kientrucdoorway.com.vn/wp-content/uploads/2019/11/thiet-ke-noi-that-phong-hop.jpg"
                  alt="Office Space"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Explore Our Facilities
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover our range of meeting rooms and facilities available
                    for booking.
                  </p>
                  <Link
                    to="/facilities"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
                  >
                    <SearchIcon className="mr-2" />
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
