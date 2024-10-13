import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Monitor,
  UserCheck,
  Zap,
  Building,
} from "lucide-react";

const WorkspaceType = ({ title, description, images, amenities }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex-1 p-4 border rounded-lg border-orange-200">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center mb-4">
        <Clock size={16} className="mr-2" />
        <span className="text-sm">Tùy theo gói</span>
      </div>
      <div className="relative mb-4">
        <img
          src={images[currentImage]}
          alt={title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImage ? "bg-white" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <h3 className="font-bold mb-2">Tiện ích</h3>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            {amenity.icon}
            <span className="ml-2">{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkspaceComparison = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const comparisons = [
    {
      standard: {
        title: "Khu vực Standard",
        description:
          "Không gian làm việc mới, dành cho thành viên Membership Standard, đầy đủ tiện nghi và đảm bảo sự riêng tư cần thiết để có thể làm việc trong thời gian dài.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "Bàn làm việc cao cấp", icon: <Monitor size={16} /> },
          { name: "Ghế công thái học", icon: <UserCheck size={16} /> },
          { name: "Check-in tự động", icon: <Zap size={16} /> },
          { name: "Ưu đãi dịch vụ", icon: <Building size={16} /> },
          { name: "Tiện ích chung", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Khu vực Premium",
        description:
          "Không gian làm việc tập trung dành cho thành viên Premium Standard với không gian có nhiều ánh sáng tự nhiên và được trang bị nhiều tiện ích cao cấp.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "Bàn làm việc cao cấp", icon: <Monitor size={16} /> },
          { name: "Ghế công thái học", icon: <UserCheck size={16} /> },
          { name: "Check-in tự động", icon: <Zap size={16} /> },
          { name: "Ưu đãi dịch vụ", icon: <Building size={16} /> },
          { name: "Tiện ích chung", icon: <Building size={16} /> },
        ],
      },
    },
    {
      standard: {
        title: "Khu vực Coworking",
        description:
          "Không gian làm việc chung linh hoạt, phù hợp cho các nhóm làm việc nhỏ hoặc freelancer.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "Bàn làm việc chung", icon: <Monitor size={16} /> },
          { name: "Phòng họp", icon: <UserCheck size={16} /> },
          { name: "Wifi tốc độ cao", icon: <Zap size={16} /> },
          { name: "Cà phê miễn phí", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Khu vực Văn phòng riêng",
        description:
          "Văn phòng riêng tư cho các công ty nhỏ và startup, được trang bị đầy đủ tiện nghi.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "Văn phòng riêng", icon: <Monitor size={16} /> },
          { name: "Phòng họp riêng", icon: <UserCheck size={16} /> },
          { name: "Bảo mật cao", icon: <Zap size={16} /> },
          { name: "Dịch vụ lễ tân", icon: <Building size={16} /> },
          { name: "Địa chỉ kinh doanh", icon: <Building size={16} /> },
        ],
      },
    },
    {
      standard: {
        title: "Khu vực Event",
        description:
          "Không gian tổ chức sự kiện, hội thảo và workshop với đầy đủ thiết bị âm thanh, ánh sáng.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "Sân khấu", icon: <Monitor size={16} /> },
          { name: "Hệ thống âm thanh", icon: <UserCheck size={16} /> },
          { name: "Máy chiếu", icon: <Zap size={16} /> },
          { name: "Bàn ghế linh hoạt", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Khu vực Sáng tạo",
        description:
          "Không gian dành cho các dự án sáng tạo, studio nhỏ với thiết bị chuyên dụng.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "Thiết bị quay phim", icon: <Monitor size={16} /> },
          { name: "Phòng thu âm", icon: <UserCheck size={16} /> },
          { name: "Máy in 3D", icon: <Zap size={16} /> },
          { name: "Phần mềm thiết kế", icon: <Building size={16} /> },
        ],
      },
    },
  ];

  const nextComparison = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % comparisons.length);
  };

  const prevComparison = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + comparisons.length) % comparisons.length
    );
  };

  return (
    <div className=" mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Không gian làm việc hiện đại</h1>
        <div className="flex space-x-2">
          <button
            onClick={prevComparison}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextComparison}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="flex gap-6">
        <WorkspaceType {...comparisons[currentIndex].standard} />
        <WorkspaceType {...comparisons[currentIndex].premium} />
      </div>
    </div>
  );
};

export default WorkspaceComparison;
