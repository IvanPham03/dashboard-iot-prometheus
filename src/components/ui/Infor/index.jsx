import React, { useEffect, useState } from 'react';
import { fetchPrometheusMetric } from '../../chart/api/fetchPrometheusMetric';  // Import hàm fetchPrometheusMetric
import FrameInfor from '../components/FrameInfor';

const Index = () => {
    const [goInfo, setGoInfo] = useState({});

    // Hàm lấy dữ liệu từ Prometheus về go_info
    const fetchGoInfo = async () => {
        try {
            // Truy vấn Prometheus để lấy thông tin go_info thông qua hàm axios
            const metricName = 'go_info';
            const result = await fetchPrometheusMetric(metricName);

            if (result !== null) {
                console.log(result[0].metric);
                setGoInfo(result[0].metric); // Lưu thông tin vào state (dữ liệu là đối tượng)
            } else {
                console.error("No data received for go_info");
            }
        } catch (error) {
            console.error("Lỗi khi truy vấn go_info:", error);
        }
    };

    useEffect(() => {
        fetchGoInfo();
        const interval = setInterval(fetchGoInfo, 10000); // Cập nhật dữ liệu mỗi 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='flex justify-between gap-4 my-2.5 p-2'>
            {/* Lặp qua các key-value trong goInfo và truyền vào FrameInfor */}
            {Object.entries(goInfo).map(([key, value], index) => (
                <FrameInfor key={index} data={{ key, value }} />
            ))}
        </div>
    );
};

export default Index;
