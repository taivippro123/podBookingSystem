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
import bgImage from '../../assets/fb.png';

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
        <span className="text-sm">Depends on package</span>
      </div>
      <div className="relative mb-2">
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
              className={`w-2 h-2 rounded-full ${index === currentImage ? "bg-white" : "bg-gray-300"
                }`}
            ></div>
          ))}
        </div>
      </div>
      <h3 className="font-bold mb-2">Utilities</h3>
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
        title: "Event Area",
        description:
          "Event, seminar and workshop space with full sound and lighting equipment.",
        images: [
          "https://phuquoc.crowneplaza.com/wp-content/uploads/2023/02/CPPQ-Meetings-Events-Lotus-U-shape-Setup-White-1-768x549.jpg",
          "https://phuquoc.crowneplaza.com/wp-content/uploads/2023/02/CPPQ-Meetings-Events-Grand-Ball-Room-Double-U-shape-Setup-Black-1-768x456.jpg",
          "https://phuquoc.crowneplaza.com/wp-content/uploads/2023/02/CPPQ-Meetings-Events-Grand-Ball-Room-Classroom-Setup-WhiteBlue-2-768x359.jpg"
        ],
        amenities: [
          { name: "Stage", icon: <Monitor size={16} /> },
          { name: "Sound system", icon: <UserCheck size={16} /> },
          { name: "Projector", icon: <Zap size={16} /> },
          { name: "Flexible tables and chairs", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Creative Zone",
        description:
          "Space for creative projects, small studio with specialized equipment.",
        images: [
          "https://www.seminaris.de/wp-content/themes/yootheme/cache/b7/seminaris-hotel-bad-honnef-meeting-room-idea-space-two-web-b7e840af.webp",
          "https://www.seminaris.de/wp-content/themes/yootheme/cache/52/seminaris-hotel-bad-boll-meeting-room-muenchen-block-creative-web-5202152e.webp",
          "https://www.seminaris.de/wp-content/themes/yootheme/cache/4d/seminaris-hotel-lueneburg-meeting-room-think-tank-web-4d3e05eb.webp",
        ],
        amenities: [
          { name: "Filming equipment", icon: <Monitor size={16} /> },
          { name: "Recording studio", icon: <UserCheck size={16} /> },
          { name: "3D Printer", icon: <Zap size={16} /> },
          { name: "Design software", icon: <Building size={16} /> },
        ],
      },
    },
    {
      standard: {
        title: "Standard Area",
        description:
          "The new workspace, available to Membership Standard members, is fully equipped and offers the privacy needed to work for long periods of time.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/b1f293e72e40e53c6d98a043c1cc3148.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/72d7d94d35b0d6bce9ae803e5e5b8975.png",
          "https://workflow.com.vn/wp-content/uploads/2024/07/174012d90de9e924e2192e3741ece56c-1.jpg",
        ],
        amenities: [
          { name: "High-end desk", icon: <Monitor size={16} /> },
          { name: "Ergonomic chair", icon: <UserCheck size={16} /> },
          { name: "Auto check-in.", icon: <Zap size={16} /> },
          { name: "Service Offers", icon: <Building size={16} /> },
          { name: "Common facilities", icon: <Building size={16} /> },
        ],
      },
      premium: {
        title: "Premium Area",
        description:
          "Premium Standard members' focused workspace with plenty of natural light and equipped with premium amenities.",
        images: [
          "https://workflow.com.vn/wp-content/uploads/2024/07/cb9919c99f173cf042d4e2a81fd5b031.jpg",
          "https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-6/466083648_535248555946406_8448144157984193108_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Gf6U5FsrefAQ7kNvgGb2Zrl&_nc_zt=23&_nc_ht=scontent.fhan3-4.fna&_nc_gid=AdOm6s60XWlzOrzdKtBrhYB&oh=00_AYCjZHV_2UYeYbVy2tLlPuzNrS7zeQpKY-Y7gquu2iQsyQ&oe=673803B9",
          "https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/466015170_535248579279737_2628973194447171832_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-VEW8LpEw2sQ7kNvgFqAgpN&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=A0OMV4Fd-9wZRbJe7i2bTBa&oh=00_AYDc9WyCCjfX54bRqnhnOmiuxqhgRiFyQBYevaXa8vxvRg&oe=6738027D"

      ],
        amenities: [,
          { name: "High-end desk", icon: <Monitor size={16} /> },
          { name: "Ergonomic chair", icon: <UserCheck size={16} /> },
          { name: "Auto check-in.", icon: <Zap size={16} /> },
          { name: "Service Offers", icon: <Building size={16} /> },
          { name: "Common facilities", icon: <Building size={16} /> },
        ],
      },
    },
    {
      standard: {
        title: "Coworking Area",
        description:
          "Flexible coworking space, suitable for small working groups or freelancers.",
        images: [
          "https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-6/464224196_523789297092332_5862053461834756687_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=xON00hNQnjsQ7kNvgFjEs8h&_nc_zt=23&_nc_ht=scontent.fhan3-4.fna&_nc_gid=AFdmGm6KBWK8EBGUaJhWTx_&oh=00_AYDHACTZydB-RX70kVBqLykLJvQ_EEQLzmXvOHjlI0oGTw&oe=673800AB",
          "https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/464175268_523789263759002_4205542199570869864_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=12LcdL2yHB0Q7kNvgG6cpfv&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=AUkEfOzvGT2AgGvR-ypkX2c&oh=00_AYCvn0U6Fk2FT0lsaKDAh8wiXwohc2O4nhZczGXM8Wg4zg&oe=67381E32",
          "https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/462776884_515660227905239_4430707227393017648_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=3zxbJoma1bMQ7kNvgGrs8Sh&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=ARpeEdK11jNa9QdtCxutP8d&oh=00_AYDRj7Xsq42ZuFvatqmMH9F27utbgNjw3TWaOYL9By7EmQ&oe=6737FB4E"
          ],
        amenities: [
          { name: "Shared desk", icon: <Monitor size={16} /> },
          { name: "Meeting room", icon: <UserCheck size={16} /> },
          { name: "High speed wifi", icon: <Zap size={16} /> },
          { name: "Free coffee", icon: <Building size={16} /> },
        ],
      },

      premium: {
        title: "Private Office Area",
        description:
          "Private offices for small companies and startups, fully equipped.",
        images: [
          "https://www.helloworldsaigon.com/wp-content/uploads/2021/01/Compressed-Private-Office-6-paxes4.jpg",

          "https://www.helloworldsaigon.com/wp-content/uploads/2021/01/Compressed-Priavte-Office-6-paxes2.jpg",
          "https://www.helloworldsaigon.com/wp-content/uploads/2021/01/Compressed-Private-Office-6-paxes1.jpg",
        ],
        amenities: [
          { name: "Private office", icon: <Monitor size={16} /> },
          { name: "Private meeting room", icon: <UserCheck size={16} /> },
          { name: "High security", icon: <Zap size={16} /> },
          { name: "Reception services", icon: <Building size={16} /> },
          { name: "Business address", icon: <Building size={16} /> },
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
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-2xl font-bold">Modern workspace</h1>
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
