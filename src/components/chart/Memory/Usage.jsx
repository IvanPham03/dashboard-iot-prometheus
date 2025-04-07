/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from 'react';
import { fetchPrometheusMetric } from '../api/fetchPrometheusMetric'; // Import hàm fetch

const Usage = () => {
    const [loading, setLoading] = useState(true);  // Trạng thái tải dữ liệu
    const goMemstatsSysBytes = useRef(0);
    const goMemstatsHeapAllocBytes = useRef(0);
    const [usagePercentage, setUsagePercentage] = useState(0); // Chỉ cập nhật tỷ lệ phần trăm

    // Chuyển đổi từ byte sang GB
    const bytesToGB = (bytes) => {
        return bytes / (1024 ** 3);  // Chia cho 1024^3 để chuyển đổi từ byte sang GB
    };

    // Hàm lấy dữ liệu từ Prometheus
    const fetchData = async () => {
        setLoading(true);  // Đặt trạng thái loading
        try {
            const sysBytes = await fetchPrometheusMetric('go_memstats_sys_bytes');
            const heapAllocBytes = await fetchPrometheusMetric('go_memstats_heap_alloc_bytes');

            goMemstatsSysBytes.current = sysBytes[0].value[1] || 0;
            goMemstatsHeapAllocBytes.current = heapAllocBytes[0].value[1] || 0;

            const sysGB = bytesToGB(goMemstatsSysBytes.current);
            const heapAllocGB = bytesToGB(goMemstatsHeapAllocBytes.current);

            const totalUsedGB = sysGB - heapAllocGB;
            const newUsagePercentage = (totalUsedGB / sysGB) * 100;

            setUsagePercentage(newUsagePercentage); // Chỉ cập nhật tỷ lệ phần trăm
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);  // Đặt trạng thái không còn tải
        }
    };

    // Gọi fetch dữ liệu khi component mount
    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 1000); // Lặp lại mỗi 10 giây

        return () => clearInterval(intervalId);  // Dọn dẹp interval khi component unmount
    }, []);

    const go_memstats_sys_gb = bytesToGB(goMemstatsSysBytes.current);
    const go_memstats_heap_alloc_gb = bytesToGB(goMemstatsHeapAllocBytes.current);
    const totalUsedGB = go_memstats_sys_gb - go_memstats_heap_alloc_gb;

    // Xác định class background dựa trên tỷ lệ phần trăm
    const backgroundClass = usagePercentage > 50 ? 'bg-red-200' : 'bg-blue-100';
    const textClass = usagePercentage > 50 ? 'text-red-600' : 'text-blue-800';

    return (
        <div className={`${backgroundClass} p-4 flex flex-col justify-between items-center w-[300px] rounded-lg`}>
            <div className='grow flex items-center'>
                <p className={`${textClass} text-[50px]`}>
                    {usagePercentage.toFixed(2)} %
                </p>
            </div>
            <div className='text-left'>
                <p>
                    Total system memory: {go_memstats_sys_gb.toFixed(2)} GB
                </p>
                <p>
                    Allocated heap memory: {go_memstats_heap_alloc_gb.toFixed(2)} GB
                </p>
                <p>
                    Memory used: {totalUsedGB.toFixed(2)} GB
                </p>
            </div>
        </div>
    );
};

export default Usage;
