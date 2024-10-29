import React from "react";
import { Link } from 'react-router-dom';

export default function WorkspaceShowcase() {
  const workspaces = [
    {
      title: "F&B space",
      description:
        "Open space with a variety of food and drinks, modern and airy, is an ideal place to meet and chat with partners and colleagues.",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-1.png",
    },
    {
      title: "Membership Space",
      description:
        "Professional workspaces for individuals and organizations. Members enjoy fixed desks, ergonomic chairs, smart check-in systems, and many other amenities to optimize work.",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-2.png",
    },
    {
      title: "Work Pod",
      description:
        "Quiet, private space with soundproofing system - isolated from the outside environment up to 70%. Suitable for tasks that require concentration and tranquility such as: negotiations, online meetings, discussions,...",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-3.png",
    },
    {
      title: "Meeting Rooms",
      description:
        "The meeting rooms have a variety of capacities (6-10 people), equipped with modern facilities, including flexible rotating multi-section tables, making the meeting more professional and inspiring.",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
    },
  ];

  return (
    <div className="bg-gray-150 min-h-screen mt-4">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3
            className="text-3xl font-bold text-gray-800"
            style={{
              //   fontFamily: "Manrope",
              fontSize: "40px",
              lineHeight: "48px",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
            Modern workspace with diverse services and amenities
          </h3>
          <Link to="/rooms" className="bg-[#352220] text-white px-4 py-2 rounded-md hover:bg-brown-800 transition duration-300">
            EXPERIENCE NOW
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between bg-white rounded-xl  shadow-md ${index === 0 || index === 3 ? "bg-yellow-50" : ""
                }`}
            >
              <div className="p-6">
                <h2 className="text-4xl mb-2 font-bold">{workspace.title}</h2>
                <p className="text-gray-600 mb-4">{workspace.description}</p>
              </div>
              <div className="p-4">
                <img
                  src={workspace.image}
                  alt={workspace.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-xl "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
