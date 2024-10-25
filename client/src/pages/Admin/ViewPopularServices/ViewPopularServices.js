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
            const formattedData = formatData(response.data);
            setData(formattedData);
        } catch (error) {
            setError('An error occurred while fetching the data.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatData = (data) => {
        return data.map(({ serviceId, serviceCount }) => ({
            serviceId,
            ServiceCount: Math.max(0, serviceCount), // Đảm bảo không có giá trị âm
        }));
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', fontSize: '18px' }}>Loading data...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', fontSize: '18px' }}>{error}</div>;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#444',
                    color: '#ffffff',
                    padding: '15px',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}>
                    <p className="label" style={{ color: '#ffffff' }}>{`Service ID: ${payload[0].payload.serviceId}`}</p>
                    <p className="label" style={{ color: '#ffffff' }}>{`Service Count: ${payload[0].payload.ServiceCount}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ color: '#333', fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>Popular Services</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis 
                        dataKey="serviceId" 
                        tick={{ fill: '#333', fontWeight: 'bold', fontSize: '16px' }} />
                    <YAxis 
                        domain={[0, 'dataMax + 1']}
                        tickCount={Math.max(5, Math.ceil(Math.max(...data.map(d => d.ServiceCount)) + 1))}
                        ticks={[0, 1, 2, 3, 4, 5]} // Tùy chỉnh các giá trị cho trục Y
                        tickFormatter={(tick) => Math.floor(tick)} 
                        tick={{ fill: '#333', fontWeight: 'bold', fontSize: '16px' }} 
                    />
                    <Legend wrapperStyle={{ color: 'black', fontWeight: 'bold', fontSize: '16px' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="ServiceCount" 
                        fill="url(#colorServiceCount)" 
                        isAnimationActive={false} 
                    />
                    <defs>
                        <linearGradient id="colorServiceCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff7f50" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ff7f50" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViewPopularServices;
