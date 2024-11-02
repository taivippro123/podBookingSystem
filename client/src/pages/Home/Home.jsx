import React, { useState, useRef, useEffect } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPinIcon,
  SearchIcon,
  Star,
  UsersIcon,
} from "lucide-react";
import { Carousel, Image } from "antd";
import { Link } from "react-router-dom";
import Home2 from "./Home2";
import WorkspaceComparison from "./WorkspaceComparison";
import RoomListHome from "./RoomListHome"
import fb from '../../assets/fb.png';
import home1 from '../../assets/home1.jpg';
import wk from '../../assets/workspace.webp';
import en from '../../assets/enterprise.webp';
import { useLocation } from 'react-router-dom';


const CARD_WIDTH = 280; // Fixed width for each card
const CARD_GAP = 16; // Gap between cards

export default function Home() {
  const [dataImg, setDataImg] = useState([
    {
      img: "https://www.seminaris.de/wp-content/themes/yootheme/cache/b7/seminaris-hotel-bad-honnef-meeting-room-idea-space-two-web-b7e840af.webp",
    },
    {
      img: "https://kientrucanviet.com/wp-content/uploads/2020/12/thi%E1%BA%BFt-k%E1%BA%BF-n%E1%BB%99i-th%E1%BA%A5t-ph%C3%B2ng-h%E1%BB%8Dp-xanh.jpg",
    },
    {
      img: "https://cdn-static.wework.com/content/images/home/hero-banner_1920x576.webp",
    },
  ]);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") { // Only load on the home page
      const initTawk = setTimeout(() => {
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const tawkScript = document.createElement("script");
        tawkScript.async = true;
        tawkScript.src = "https://embed.tawk.to/6720a3062480f5b4f5958a31/1ibbnplfq";
        tawkScript.charset = "UTF-8";
        tawkScript.setAttribute("crossorigin", "*");

        document.body.appendChild(tawkScript);
      }, 500);

      return () => {
        clearTimeout(initTawk);
        const tawkScript = document.querySelector('script[src="https://embed.tawk.to/6720a3062480f5b4f5958a31/1ibbnplfq"]');
        if (tawkScript) document.body.removeChild(tawkScript);
        delete window.Tawk_API;
      };
    }
  }, [location.pathname]); // Runs only once on component mount

  return (
    <>
      <main className="flex-grow">
        <section className="bg-gray-100 py-2">
          <div className="container mx-auto px-4">
            <div className="h-[50vh] mt-10 relative">
              <Carousel autoplay arrows={true} infinite={false}>
                {dataImg.map((value, index) => (
                  <div className="flex justify-center items-center relative" key={index}>
                    <img
                      className="object-cover h-[50vh] w-screen"
                      alt={`Carousel image ${index}`}
                      src={value.img}
                    />
                    {/* Overlay Container */}
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-40">
                      {/* Title */}
                      <h1 className="text-3xl text-white font-semibold mb-4 shadow-md">WorkZone</h1>
                      {/* Button Section */}
                      <div className="flex space-x-6 items-center">
                        {/* Booking Button */}
                        <Link to="/rooms">
                          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105">
                            BOOKING NOW
                          </button>
                        </Link>

                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="mt-2">
              <RoomListHome />
            </div>   

            <div className="mt-2">
              <Home2 />
            </div>


            <div className="mt-2">
              <WorkspaceComparison />
            </div>

            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[400px] w-full">
                  <Image
                    src={wk}
                    alt="Two men working on laptops in a modern office space"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 text-left">Workspace made simple</h2>
                  <p className="text-lg text-gray-700 text-left">
                    Whatever your budget or need, we make finding the perfect workspace easy. From flexible memberships to move-in ready offices, we give you the space and solutions to do your best work.
                  </p>
                  <Link href="#">
                    <a className="text-blue-600 hover:underline text-left">Learn more ➝</a>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 text-left">Enterprise-grade solutions to power your hybrid strategy</h2>
                  <p className="text-lg text-gray-700 text-left">
                    Give your real estate portfolio more flexibility while saving on costs by combining our turnkey offices, coworking spaces, and space management technology.
                  </p>
                  <Link href="#">
                    <a className="text-blue-600 hover:underline text-left">Learn more ➝</a>
                  </Link>
                </div>
                <div className="relative h-[400px] w-full">
                  <Image
                    src={en}
                    alt="Two men working on laptops in a modern office space"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[300px] w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/7LzIRUT4hu0"
                    title="YouTube video player"
                    frameBorder="15"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 text-left">Workspace made simple</h2>
                  <p className="text-lg text-gray-700 text-left">
                    Whatever your budget or need, we make finding the perfect workspace easy. From flexible memberships to move-in ready offices, we give you the space and solutions to do your best work.
                  </p>
                  <Link href="#">
                    <a className="text-blue-600 hover:underline text-left">Learn more ➝</a>
                  </Link>
                </div>
              </div>
            </div>


            {/* <div className="grid md:grid-cols-2 gap-8 mt-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://www.helloworldsaigon.com/wp-content/uploads/2021/01/Compressed-Private-Office-6-paxes4.jpg"
                  alt="Team Meeting"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    About Us
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We are a team of experts providing the best technology solutions for your business.
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                  >
                    <UsersIcon className="mr-2" />
                    About Us
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={fb}
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
            </div> */}
          </div>
        </section>
      </main>
    </>
  );
}
