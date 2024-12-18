import React, { useEffect, useState } from "react";
import { Affix, Dropdown, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { CalendarIcon } from "lucide-react";
import axios from "axios"; // For fetching data

const navigation = [
  { name: "Dashboard", href: "/admin/institute", current: false },
  { name: "Team", href: "/Team", current: false },
  { name: "Projects", href: "/", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];

function ComHeader({ children }) {
  const [headerNavigation, setHeaderNavigation] = useState(navigation);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activeCategory, setActiveCategory] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))); // User state
  const [rooms, setRooms] = useState([]); // State to hold room data

  // Fetch room data
  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get("http://localhost:5000/rooms"); // Replace with your actual endpoint
        setRooms(response.data); // Assuming the response is an array of rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    }
    fetchRooms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Clear user state
    navigate("/");
  };

  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);

  useEffect(() => {
    changeNavigation(currentPath);
  }, [currentPath]);

  const changeNavigation = (path) => {
    setHeaderNavigation((prevNavigation) =>
      prevNavigation.map((item) => ({
        ...item,
        current: item.href === path,
      }))
    );
  };

  const userMenu = (
    <Menu>
      <Menu.Item>
        <Link to={`/profile/${user?.userId}`}>
          View Profile
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/viewbookings/${user?.userId}`}>
          View Booking
        </Link>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <span>Logout</span>
      </Menu.Item>
    </Menu>
  );

  // Function to update user state
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser); // Update user state with new user data
  };

  return (
    <div className="min-h-full">
      <Affix offsetTop={0} className="fixed-sidebar">
        <header className="font-sans">
          <div className="bg-black text-white py-2 px-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Connect:</span>
                <Link
                  to="https://www.facebook.com/qv12a"
                  className="text-white hover:text-gray-200 text-lg"
                >
                  <FaFacebookF />
                </Link>
                <Link to="" className="text-white hover:text-gray-200 text-lg">
                  <FaInstagram />
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                {user ? (
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer">
                      {user.userName}
                    </button>
                  </Dropdown>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white py-4 px-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center md:px-10">
              <Link
                to="/"
                className="text-2xl font-bold text-blue-900 flex justify-center items-center"
              >
                <CalendarIcon className="h-6 w-6" /> Work
                <span className="text-blue-500"> Zone</span>
              </Link>

              <div className="flex-grow mx-10 text-lg">
                <nav className="bg-white border-t border-gray-200">
                  <div className="container mx-auto">
                    <ul className="flex justify-center space-x-8 py-3 text-sm font-medium">
                      <li>
                        <Link
                          to="/rooms"
                          className={`text-blue-900 hover:text-blue-700 text-center ${currentPath === "/rooms" ? "border-b-2 border-blue-700" : ""
                            }`}
                        >
                          ROOM
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/about"
                          className={`text-blue-900 hover:text-blue-700 text-center ${currentPath === "/about" ? "border-b-2 border-blue-700" : ""
                            }`}
                        >
                          ABOUT US
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          className={`text-blue-900 hover:text-blue-700 text-center ${currentPath === "/contact" ? "border-b-2 border-blue-700" : ""
                            }`}
                        >
                          CONTACT US
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>


            </div>
          </div>
        </header>
      </Affix>

      <main>
        <div>{children}</div>
      </main>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          {/* Our Services Section */}
          <div>
            <h3 className="font-bold mb-4">OUR SERVICES</h3>
            <ul className="space-y-2">
              <li>
                <a href="/rooms" className="hover:underline">
                  All
                </a>
              </li>
              {rooms.map((room) => (
                <li key={room.roomId}>
                  <Link to={`/room/${room.roomId}`} className="hover:underline">
                    {room.roomType}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-bold mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="font-bold mb-4">LEGAL</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="hover:underline">
                  Terms of use
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:underline">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="hover:underline">
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-gray-600 pt-4">
          <div className="flex items-center justify-center space-x-2">
            <p>&copy; 2024 WorkZone. POD Booking System All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ComHeader;
