/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { format, subMinutes, subHours } from 'date-fns';

// Component tái sử dụng để vẽ biểu đồ Radar
const MetricRadarChart = ({ metricName, title, color }) => {

    const [data, setData] = useState([]);

    // Hàm lấy dữ liệu từ Prometheus bằng fetch
    const fetchData = async () => {
        try {
            // Tính toán thời gian bắt đầu và kết thúc
            const nowVN = new Date();
            const nowUTC = subHours(nowVN, 7);  // Chuyển giờ Việt Nam sang UTC
            const fiveMinutesAgoUTC = subMinutes(nowUTC, 5);  // Lấy dữ liệu 5 phút trước

            const start = format(fiveMinutesAgoUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
            const end = format(nowUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
            const step = '1s';  // Lấy dữ liệu mỗi giây

            const query = `rate(${metricName}[1m])`;  // Sử dụng metricName truyền vào

            // Xây dựng URL truy vấn
            const url = `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`;

            // Gửi yêu cầu với fetch
            const response = await fetch(url);
            const res = await response.json();

            // Kiểm tra nếu có kết quả
            if (!res || !res.data || !res.data.result) {
                console.error("No data received");
                return;
            }

            const results = res.data.result;

            // Tạo dữ liệu cho biểu đồ radar
            const timestamps = results[0]?.values.map(([t]) => new Date(t * 1000).toLocaleTimeString()) || [];

            // Xử lý dữ liệu và tạo map dữ liệu
            const dataMap = timestamps.map((time, idx) => {
                const entry = { time };

                results.forEach(({ metric, values }) => {
                    const current = parseFloat(values[idx][1]) || 0;
                    entry[`value`] = current;  // Đặt giá trị vào key `value` cho Radar
                });

                return entry;
            });

            setData(dataMap); // Lưu dữ liệu vào state
        } catch (error) {
            console.error("Lỗi khi truy vấn Prometheus:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Cập nhật dữ liệu mỗi 10s
        return () => clearInterval(interval);
    }, [metricName]);  // Dependency vào metricName để thay đổi khi metric thay đổi


    return (
        <div className="p-4 w-full border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                {data && data.length > 0 ? (
                    <RadarChart data={data}>
                        <PolarGrid />
                        {/* <PolarAngleAxis dataKey="time" /> */}
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Radar
                            name={title}
                            dataKey="value"
                            stroke={color}
                            fill={color}
                            fillOpacity={0.6}
                            legendType="diamond"
                        />
                    </RadarChart>
                ) : (
                    <p>Loading data...</p>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default MetricRadarChart;
