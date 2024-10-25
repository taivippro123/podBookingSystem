import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'; // Import các thành phần từ thư viện Recharts để vẽ biểu đồ
import axios from 'axios'; // Import axios để thực hiện các yêu cầu HTTP

const ViewPopularRooms = () => {
    // State để lưu trữ dữ liệu phòng phổ biến
    const [data, setData] = useState([]);
    // State để quản lý trạng thái tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State để lưu trữ thông tin lỗi (nếu có)
    const [error, setError] = useState(null);

    // Hàm để lấy dữ liệu từ API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/popular-rooms'); // Gửi yêu cầu GET đến API
            const formattedData = formatData(response.data); // Định dạng dữ liệu
            setData(formattedData); // Lưu dữ liệu vào state
        } catch (error) {
            setError('An error occurred while fetching the data.'); // Cập nhật thông báo lỗi
            console.error('Error fetching data:', error); // In lỗi ra console
        } finally {
            setLoading(false); // Đặt trạng thái tải dữ liệu thành false
        }
    };

    // Hàm để định dạng dữ liệu cho biểu đồ
    const formatData = (data) => {
        return data.map(({ roomId, bookingCount }) => ({
            roomId, // Mã định danh phòng
            BookingCount: bookingCount, // Số lượng đặt phòng đã thực hiện, được đổi tên thành BookingCount
        }));
    };

    useEffect(() => {
        fetchData(); // Gọi hàm fetchData khi component được gắn
    }, []);

    // Hiển thị thông báo tải dữ liệu nếu đang trong trạng thái tải
    if (loading) {
        return <div>Loading data...</div>;
    }

    // Hiển thị thông báo lỗi nếu có lỗi xảy ra
    if (error) {
        return <div>{error}</div>;
    }

    // Hàm để tùy chỉnh nội dung hiển thị của tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#444', // Nền tối hơn cho tooltip
                    color: '#ffffff', // Màu chữ trắng để nổi bật trên nền tối
                    padding: '15px',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Đổ bóng cho tooltip
                    fontSize: '18px', // Kích thước chữ lớn hơn
                    fontWeight: 'bold' // Chữ đậm
                }}>
                    <p className="label">{`Room ID: ${payload[0].payload.roomId}`}</p>
                    <p className="label">{`Booking Count: ${payload[0].payload.BookingCount}`}</p>
                </div>
            );
        }
        return null; // Trả về null nếu không cần hiển thị tooltip
    };

    return (
        <div>
            <h2 style={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}>Popular Rooms</h2> {/* Tiêu đề cho biểu đồ */}
            <ResponsiveContainer width="100%" height={400}> {/* Đảm bảo biểu đồ phản hồi với kích thước của container */}
                <BarChart data={data}> {/* Khởi tạo biểu đồ cột với dữ liệu */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" /> {/* Lưới cho biểu đồ, màu xám nhạt */}
                    <XAxis 
                        dataKey="roomId" 
                        tick={{ fill: 'black', fontWeight: 'bold', fontSize: '16px' }} /> {/* Trục X hiển thị mã phòng với màu chữ đen và đậm */}
                    <YAxis 
                        tick={{ fill: 'black', fontWeight: 'bold', fontSize: '16px' }} /> {/* Trục Y với màu chữ đen và đậm */}
                    <Legend wrapperStyle={{ color: 'black', fontWeight: 'bold', fontSize: '16px' }} /> {/* Hiển thị chú giải với màu chữ sáng và đậm */}
                    <Tooltip content={<CustomTooltip />} /> {/* Sử dụng tooltip tùy chỉnh để hiển thị thông tin chi tiết */}
                    <Bar 
                        dataKey="BookingCount" // Tên khóa dữ liệu cho trục Y, biểu thị số lượng đặt phòng
                        fill="url(#colorBookingCount)" // Sử dụng gradient cho cột
                        isAnimationActive={false} // Vô hiệu hóa hiệu ứng animation
                    /> 
                    <defs> {/* Định nghĩa gradient cho màu sắc cột */}
                        <linearGradient id="colorBookingCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViewPopularRooms; // Xuất component để sử dụng ở nơi khác
