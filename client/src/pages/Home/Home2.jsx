import React from "react";

export default function WorkspaceShowcase() {
  const workspaces = [
    {
      title: "Không gian F&B",
      description:
        "Không gian mở với nhiều đồ ăn, thức uống đa dạng, mang nét hiện đại, thoáng đãng, là điểm lý tưởng để gặp gỡ, trao chuyện cùng đối tác và đồng nghiệp.",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-1.png",
    },
    {
      title: "Không gian Membership",
      description:
        "Khu vực làm việc chuyên nghiệp dành cho cá nhân và tổ chức. Thành viên được sử dụng bàn làm việc cố định, ghế công thái học, hệ thống check-in thông minh cùng nhiều tiện ích khác để tối ưu công việc.",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-2.png",
    },
    {
      title: "Pod làm việc",
      description:
        "Không gian yên tĩnh, riêng tư với hệ thống cách âm - biệt lập với môi trường bên ngoài lên đến 70%. Thích hợp cho những việc cần sự tập trung và tĩnh tâm như: đàm phán, họp trực tuyến, thảo luận,...",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-3.png",
    },
    {
      title: "Phòng họp",
      description:
        "Các phòng họp có đa dạng sức chứa (6-10 người), được trang bị cơ sở vật chất hiện đại, bao gồm bàn nhiều mảng xoay linh quang, giúp cuộc họp trở nên chuyên nghiệp và mang nhiều cảm hứng.",
      image:
        "https://workflow.com.vn/wp-content/uploads/2024/05/z5404832229897_c592108c054d4505476d97f2bbd6f86e-4.png",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen mt-4">
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
            Không gian làm việc hiện đại với đa dạng dịch vụ và tiện ích
          </h3>
          <button className="bg-[#352220] text-white px-4 py-2 rounded-md hover:bg-brown-800 transition duration-300">
            TRẢI NGHIỆM NGAY
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between bg-white rounded-xl  shadow-md ${
                index === 0 || index === 3 ? "bg-yellow-50" : ""
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
