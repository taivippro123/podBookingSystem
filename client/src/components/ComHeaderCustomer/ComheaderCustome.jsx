import React, { Fragment, useEffect, useState } from "react";
import { Affix, Dropdown, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaFacebookF, FaInstagram, FaSearch, FaShoppingCart } from "react-icons/fa";
import { CalendarIcon } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin/institute", current: false },
  { name: "Team", href: "/Team", current: false },
  { name: "Projects", href: "/", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const language = [
  { name: "Việt Nam", href: "vn" },
  { name: "English", href: "en" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeader({ children }) {
  const [headerNavigation, setHeaderNavigation] = useState(navigation);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activeCategory, setActiveCategory] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);

  const methods = useForm({
    resolver: yupResolver(),
    defaultValues: {
      search: "",
    },
  });

  const { handleSubmit, register, setFocus, watch, setValue } = methods;

  useEffect(() => {
    changeNavigation2(currentPath);
  }, []);

  const changeNavigation2 = (path) => {
    setHeaderNavigation((prevNavigation) =>
      prevNavigation.map((item) => {
        if (item.href === path) {
          return { ...item, current: true };
        } else {
          return { ...item, current: false };
        }
      })
    );
  };

  const userMenu = (
    <Menu>
      <Menu.Item>
        <Link to={`/profile/${user?.userId}`}>View Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/viewbookings/${user?.userId}`}>View Booking</Link>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <span>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
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
                    <Dropdown overlay={userMenu} trigger={['click']}>
                      <span className="text-white hover:underline cursor-pointer">
                        {user.userName}
                      </span>
                    </Dropdown>
                  ) : (
                    <Link to="/login" className="hover:underline cursor-pointer text-white">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white py-4 px-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center md:px-10">
                <Link to="/" className="text-2xl font-bold text-blue-900 flex justify-center items-center">
                  <CalendarIcon className="h-6 w-6" /> Work
                  <span className="text-blue-500"> Zone</span>
                </Link>
                
                <div className="flex-grow mx-10 text-lg">
                  <nav className="bg-white border-t border-gray-200">
                    <div className="container mx-auto">
                      <ul className="flex justify-center space-x-8 py-3 text-sm font-medium">
                        <li>
                          <Link to="/rooms" className="text-blue-900 hover:text-blue-700 text-center">
                            ROOM
                          </Link>
                        </li>
                        <li>
                          <Link to="/about" className="text-blue-900 hover:text-blue-700 text-center">
                            ABOUT US
                          </Link>
                        </li>
                        <li>
                          <Link to="/contact" className="text-blue-900 hover:text-blue-700 text-center">
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
          <div className="">{children}</div>
        </main>

        <footer className="bg-black text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 WorkZone. All rights reserved.</p>
            <nav className="mt-4">
              <ul className="flex justify-center space-x-6">
                <li>
                  <Link to="/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
