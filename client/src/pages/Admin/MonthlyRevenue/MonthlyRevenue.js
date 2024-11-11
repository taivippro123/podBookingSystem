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
} from 'recharts';
import axios from 'axios';

const MonthlyRevenue = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getMonthlyRevenue');
            const formattedData = response.data.monthlyRevenue.map(item => ({
                month: item.month,
                totalRevenue: parseInt(item.totalRevenue, 10), // Chuyển giá trị thành số
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Monthly Revenue</h2>
            <ResponsiveContainer width="105%" height={400} >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
            padding={{ top: 20, bottom: 20 }}  // Thêm padding để tạo khoảng cách
            tick={{ angle: 0, fontSize: 12 }}  // Điều chỉnh kích thước và góc của số liệu
        />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalRevenue" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyRevenue;
