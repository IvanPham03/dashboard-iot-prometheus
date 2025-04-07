import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const PrometheusRemoteStorageChart = () => {
    const [data, setData] = useState([]);

    const metrics = [
        {
            key: 'exemplars_in',
            metric: 'prometheus_engine_query_samples_total',
        },
        {
            key: 'samples_in',
            metric: 'prometheus_remote_storage_samples_in_total',
        },
    ];

    // Hàm chuyển đổi giá trị từ byte sang MB
    const convertToMB = (valueInBytes) => {
        return valueInBytes / 1024 / 1024;  // Chuyển từ byte sang MB
    };

    // Hàm tạo số ngẫu nhiên xung quanh giá trị trung bình với độ lệch khác nhau cho từng metric
    const randomizeValue = (value, metricKey, variance = 0.1) => {
        const randomFactor = 1 + (Math.random() - 0.5) * variance;

        // Tùy chỉnh độ lệch cho từng metric
        if (metricKey === 'exemplars_in') {
            return value * (1 + Math.random() - 0.5 * 0.5); // Độ lệch lớn hơn cho exemplars_in
        }
        return value * randomFactor * Math.random() * 100;  // Độ lệch mặc định cho samples_in
    };

    const fetchMetrics = async () => {
        try {
            const timestamp = new Date().toLocaleTimeString();

            const results = await Promise.all(
                metrics.map(async ({ key, metric }) => {
                    const url = `http://localhost:9090/api/v1/query?query=${metric}`;

                    const response = await fetch(url);
                    const result = await response.json();

                    if (result && result.data && result.data.result) {
                        const valueInBytes = parseFloat(result.data.result[0]?.value[1]) || 0;
                        const valueInMB = convertToMB(valueInBytes); // Chuyển đổi sang MB
                        const randomizedValue = randomizeValue(valueInMB, key); // Thêm sự thay đổi ngẫu nhiên với độ lệch riêng biệt cho mỗi metric
                        return { key, value: randomizedValue };
                    } else {
                        return { key, value: 0 };
                    }
                })
            );

            const newDataPoint = { time: timestamp };
            results.forEach((item) => {
                newDataPoint[item.key] = item.value;
            });

            setData((prev) => [...prev.slice(-20), newDataPoint]); // Giữ 20 điểm gần nhất
        } catch (error) {
            console.error('Lỗi khi fetch dữ liệu:', error);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000); // Cập nhật mỗi 2 giây
        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400} className="p-1 border rounded-lg my-2.5">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="exemplars" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8} /> {/* Màu đỏ */}
                        <stop offset="95%" stopColor="#ff0000" stopOpacity={0} /> {/* Màu đỏ */}
                    </linearGradient>
                    <linearGradient id="samples" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff00" stopOpacity={0.8} /> {/* Màu xanh lá */}
                        <stop offset="95%" stopColor="#00ff00" stopOpacity={0} /> {/* Màu xanh lá */}
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="exemplars_in"
                    stackId="1"
                    stroke="#ff0000"
                    fill="url(#exemplars)"
                />
                <Area
                    type="monotone"
                    dataKey="samples_in"
                    stackId="1"
                    stroke="#ffc658"
                    fill="url(#samples)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default PrometheusRemoteStorageChart;
