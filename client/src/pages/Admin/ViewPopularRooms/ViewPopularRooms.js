import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const ViewPopularRooms = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/popular-rooms');
            const formattedData = response.data.map(({ roomName, bookingCount }) => ({
                roomName: roomName || 'Unknown Room', // Đảm bảo không có giá trị undefined
                bookingCount: Math.max(0, bookingCount || 0), // Đảm bảo giá trị không âm
            }));
            setData(formattedData);
        } catch (error) {
            setError('Error fetching data.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>{error}</div>;

    // Cấu hình biểu đồ
    const chartOptions = {
        chart: {
            type: 'pie',
            height: 350,
        },
        title: {
            text: 'Popular Rooms',
            align: 'center',
        },
        labels: data.length > 0 ? data.map(item => item.roomName) : ['No Data'], // Đảm bảo labels không undefined
        colors: ['#ff7f50', '#1E90FF', '#FFD700', '#32CD32', '#FF4500'],
        tooltip: {
            y: {
                formatter: (value) => {
                    const totalCount = data.reduce((acc, item) => acc + item.bookingCount, 0);
                    const percentage = totalCount ? ((value / totalCount) * 100).toFixed(2) : 0; // Tránh chia cho 0
                    return `${value} (${percentage}%)`; // Hiển thị số liệu và phần trăm
                },
            },
        },
        legend: {
            position: 'bottom',
            floating: false,
            horizontalAlign: 'center',
            verticalAlign: 'top',
            offsetY: 10,
        },
    };

    const chartData = data.length > 0 ? data.map(item => item.bookingCount) : [0]; // Đảm bảo có dữ liệu cho biểu đồ

    return (
        <div>
            <Chart options={chartOptions} series={chartData} type="pie" height={350} />
        </div>
    );
};

export default ViewPopularRooms;
