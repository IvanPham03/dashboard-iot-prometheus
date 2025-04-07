/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { fetchPrometheusMetric } from '../api/fetchPrometheusMetric';
import Process from './Process';

const Index = () => {
    const [metrics, setMetrics] = useState({
        maxFdsVal: null,
        openFdsVal: null,
        startTimeVal: null,
        maxVmemVal: null,
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            const maxFds = await fetchPrometheusMetric('process_max_fds');
            const openFds = await fetchPrometheusMetric('process_open_fds');
            const startTime = await fetchPrometheusMetric('process_start_time_seconds');
            const maxVmem = await fetchPrometheusMetric('process_virtual_memory_max_bytes');

            // Lấy giá trị đầu tiên từ kết quả trả về và xử lý nếu có giá trị
            let maxFdsVal = maxFds?.[0]?.value?.[1] ?? null;
            let openFdsVal = openFds?.[0]?.value?.[1] ?? null;
            let startTimeVal = startTime?.[0]?.value?.[1] ?? null;
            let maxVmemVal = maxVmem?.[0]?.value?.[1] ?? null;

            console.log(maxFdsVal);

            setMetrics({
                maxFdsVal,
                openFdsVal,
                startTimeVal,
                maxVmemVal,
            });
        };

        fetchMetrics();
    }, []);

    return (
        <div className='flex flex-col gap-[20px] my-[20px]'>
            <div className='flex justify-between gap-[20px]'>
                <p className='border rounded-lg p-2 grow'>
                    Max Open File Descriptors: {metrics.maxFdsVal ?? 'Loading...'}
                </p>
                <p className='border rounded-lg p-2 grow'>
                    Open File Descriptors: {metrics.openFdsVal ?? 'Loading...'}
                </p>
                <p className='border rounded-lg p-2 grow'>
                    Process Start Time: {metrics.startTimeVal ? new Date(metrics.startTimeVal * 1000).toLocaleString() : 'Loading...'}
                </p>
                <p className='border rounded-lg p-2 grow'>
                    Max Virtual Memory: {metrics.maxVmemVal ? (metrics.maxVmemVal / (1024 **4 )).toFixed(2) + ' TB' : 'Loading...'}
                </p>
            </div>
            <Process />
        </div>
    );
};

export default Index;
