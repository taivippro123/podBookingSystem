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

const ViewPopularRooms = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/popular-rooms');
            const formattedData = response.data.map(({ roomId, bookingCount }) => ({
                roomId,
                BookingCount: bookingCount,
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

    return (
        <div>
            <h2>Popular Rooms</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="roomId" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="BookingCount" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViewPopularRooms;
