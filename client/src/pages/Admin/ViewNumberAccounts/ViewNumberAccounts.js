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

const ViewNumberAccounts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/number-accounts');
            const formattedData = formatData(response.data);
            setData(formattedData);
        } catch (error) {
            setError('Có lỗi xảy ra khi lấy dữ liệu.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format the data for the chart
    const formatData = (data) => {
        return Object.entries(data).map(([type, count]) => ({
            type,
            Accounts: count,  // Đổi từ "count" thành "Accounts"
        }));
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Total Account</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Accounts" fill="#82ca9d" /> {/* Sử dụng "Accounts" ở đây */}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViewNumberAccounts;
