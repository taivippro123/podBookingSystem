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

const ViewPopularServices = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/popular-services');
            const formattedData = response.data.map(({ serviceName, serviceCount }) => ({
                serviceName,
                ServiceCount: Math.max(0, serviceCount), // Ensure no negative values
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
            <h2>Popular Services</h2>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serviceName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ServiceCount" fill="#ff7f50" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViewPopularServices;
