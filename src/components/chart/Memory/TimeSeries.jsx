/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPrometheusMetricRange } from '../api/fetchPrometheusMetric'; // Import hàm fetch

const TimeSeries = () => {
    const [data, setData] = useState([]); // Tạo mảng dữ liệu ban đầu cho Recharts
    const [loading, setLoading] = useState(true); // Thêm state để quản lý trạng thái tải dữ liệu

    // Hàm fetch dữ liệu từ Prometheus
    const fetchData = async () => {
        const now = new Date();
        const startTime = new Date(now.getTime() - 1 * 60 * 1000); // 5 phút trước
        const endTime = now;

        // Thực hiện gọi fetch dữ liệu Prometheus
        const result = await fetchPrometheusMetricRange('rate(process_cpu_seconds_total[5m])', startTime.toISOString(), endTime.toISOString());

        // Kiểm tra và xử lý dữ liệu
        if (result && result.length > 0) {
            const formattedData = result.map(item => ({
                timestamp: item.timestamp,
                value: item.value,
            }));

            // Cập nhật dữ liệu vào state, thêm mới dữ liệu mỗi lần fetch
            setData(prevData => {
                const newData = [...prevData, ...formattedData];

                if (newData.length > 20) {
                    return newData.slice(newData.length - 20); // Giữ lại MAX_DATA_POINTS phần tử cuối cùng
                }

                return newData;
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    // UseEffect để fetch dữ liệu mỗi giây
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 1000); // Fetch mỗi 1 giây

        // Cleanup interval khi component bị unmount
        return () => clearInterval(intervalId);
    }, []); // Chạy một lần khi component mount

    // Nếu dữ liệu đang tải, hiển thị loading
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className='p-4 border rounded-lg drop-shadow-xl/25 grow'>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        {/* Định nghĩa gradient */}
                        <linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF7300" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* Thêm màu cho lưới */}
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} // Định dạng giờ:phút:giây
                    />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} /> {/* Thêm màu cho tooltip */}
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FF0000"
                        fill="url(#colorUv)" // Sử dụng gradient
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimeSeries;
