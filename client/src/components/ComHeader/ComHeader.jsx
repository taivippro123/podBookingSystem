import { Fragment, useEffect, useState } from "react";
import { Affix } from "antd";
import { Link, useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FaFacebookF,
  FaInstagram,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { CalendarIcon } from "lucide-react";
const navigation = [
  { name: "Dashboard", href: "/admin/institute", current: false },
  { name: "Team", href: "/Team", current: false },
  { name: "Projects", href: "/", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "/" },
  { name: "Settings", href: "/" },
  { name: "Sign out", href: "/login" },
];
const language = [
  { name: "Việt Nam", href: "vn" },
  { name: "English", href: "en" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeader({ children }) {
  const [headerNavigation, setheaderNavigation] = useState(navigation);
  const location = useLocation();
  const currentPath = location.pathname;

  const [activeCategory, setActiveCategory] = useState(null);
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
    setheaderNavigation((prevNavigation) =>
      prevNavigation.map((item) => {
        if (item.href === path) {
          return { ...item, current: true };
        } else {
          return { ...item, current: false };
        }
      })
    );
  };

  return (
    <>
      <div className="min-h-full">
        <Affix offsetTop={0} className="fixed-sidebar ">
          <header className="font-sans">
            <div className="bg-black text-white py-2 px-4">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Connect:</span>
                  <Link
                    to="https://www.facebook.com/qv12a"
                    className="text-white hover:text-gray-200  text-lg"
                  >
                    <FaFacebookF />
                  </Link>
                  <Link
                    to=""
                    className="text-white hover:text-gray-200  text-lg"
                  >
                    <FaInstagram />
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <Link to="" className="hover:underline">
                  Support
                  </Link>
                  {/* <Link to="" className="hover:underline">
                    Đăng Ký
                  </Link> */}
                  <Link to="/login" className="hover:underline">
                  Log in
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white py-4 px-4 shadow-md ">
              <div className="container mx-auto flex justify-between items-center md:px-10">
                <Link
                  to="/"
                  className="text-2xl font-bold text-blue-900 flex justify-center items-center"
                >
                  <CalendarIcon className="h-6 w-6" /> Work
                  <span className="text-blue-500"> Zone</span>
                </Link>
                
                <div className="flex-grow mx-10  text-lg">
                <nav className="bg-white border-t border-gray-200">
              <div className="container mx-auto">
                <ul className="flex justify-center space-x-8 py-3 text-sm font-medium">
                  <li>
                    <Link
                      to="/"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      MEETING ROOM
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      SUPPLY CHANNEL
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/about"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      ABOUT US
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

        {/* <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header> */}
        <main>
          <div className="">{children}</div>
        </main>

        <footer className="bg-black text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 WorkZone. All rights reserved.</p>
            <nav className="mt-4">
              <ul className="flex justify-center space-x-6">
                <li>
                  <Link href="/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to ="/contact" className="hover:underline">
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
