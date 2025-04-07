import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMinutes, subHours } from 'date-fns';
import { fetchPrometheusMetricRange } from '../api/fetchPrometheusMetric';

const Process = () => {
  const [data, setData] = useState([]);

  const MAX_DATA_POINTS = 100; // Giới hạn số lượng điểm dữ liệu tối đa (ví dụ 1 phút)


  // Hàm lấy dữ liệu từ Prometheus
  const fetchPrometheusData = async () => {
    const nowVN = new Date(); // Thời gian hiện tại theo giờ Việt Nam = UTC+7
    const nowUTC = subHours(nowVN, 7); // Chuyển đổi sang UTC
    const fiveMinutesAgoUTC = subMinutes(nowUTC, 5); // Tính thời gian 5 phút trước theo UTC
    const startTime = format(fiveMinutesAgoUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const endTime = format(nowUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const metricName = 'rate(process_cpu_seconds_total[1m])';  // Truy vấn metric

    try {
      // Lấy dữ liệu từ Prometheus thông qua hàm fetchPrometheusMetricRange
      const newData = await fetchPrometheusMetricRange(metricName, startTime, endTime);

      if (newData && newData.length > 0) {
        const processedData = newData.map((point) => ({
          timestamp: point.timestamp,
          value: point.value,  // Chuyển đổi giá trị từ byte sang MB
        }));

        setData((prevData) => {
          // Ghép dữ liệu mới vào cuối mảng
          const updatedData = [...prevData, ...processedData];

          // Nếu mảng có nhiều điểm dữ liệu hơn MAX_DATA_POINTS, cắt bớt
          if (updatedData.length > MAX_DATA_POINTS) {
            return updatedData.slice(updatedData.length - MAX_DATA_POINTS); // Giữ lại MAX_DATA_POINTS phần tử cuối cùng
          }
          return updatedData; // Trả về mảng dữ liệu mới
        });
      }
    } catch (error) {
      console.error('Lỗi khi truy vấn Prometheus:', error);
    }
  };

  // Fetch dữ liệu mỗi 1 giây một lần (có thể điều chỉnh thời gian theo ý muốn)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPrometheusData();
    }, 1000);  // Cập nhật dữ liệu mỗi 1 giây

    return () => clearInterval(intervalId); // Cleanup khi component unmount
  }, []);
  return (
    <ResponsiveContainer height={400} className={`p-2 border rounded-lg drop-shadow-lg `}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip formatter={(value) => `${value.toFixed(2)} KB`} />  {/* Hiển thị giá trị với đơn vị MB trong Tooltip */}
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Process;