import React, { useEffect, useState } from 'react';
import { format, subMinutes, subHours } from 'date-fns';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const NetworkBarChart = ({ metricName, color = '#8884d8', title = 'Metric Chart' }) => {
    const [data, setData] = useState([]);

    const getPrometheusQueryUrl = () => {
        const nowVN = new Date();
        const nowUTC = subHours(nowVN, 7);
        const fiveMinutesAgoUTC = subMinutes(nowUTC, 5);

        const start = format(fiveMinutesAgoUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        const end = format(nowUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        const step = '1s'; // Tùy chỉnh step nếu cần

        const query = encodeURIComponent(`rate(${metricName}[5m])`);
        return `http://localhost:9090/api/v1/query_range?query=${query}&start=${start}&end=${end}&step=${step}`;
    };

    const fetchData = async () => {
        try {
            const url = getPrometheusQueryUrl();
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.data && result.data.result && result.data.result.length > 0) {
                const values = result.data.result[0].values.map(([timestamp, value]) => ({
                    time: new Date(timestamp * 1000).toLocaleTimeString(),
                    value: parseFloat(value),
                }));

                setData(values);
            }
        } catch (error) {
            console.error('Lỗi truy vấn Prometheus:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000); // Cập nhật mỗi 3 giây
        return () => clearInterval(interval);
    }, [metricName]);

    return (
        <div className="p-4 w-full border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={color} name="Value/s" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NetworkBarChart;
