import React from 'react';
import MetricRadarChart from './MetricRadarChart';

const Index = () => {
  // Mảng các metric cần vẽ, mỗi metric sẽ có một màu riêng
  const metrics = [
    { metricName: 'go_gc_cycles_automatic_gc_cycles_total', title: 'Completed GC Cycle', color: '#8884d8' },
    { metricName: 'go_gc_heap_allocs_bytes_total', title: 'Memory Allocated to Heap', color: '#82ca9d' },
    { metricName: 'go_gc_cycles_total_gc_cycles_total', title: 'Total Garbage Collection Cycles', color: '#ff7300' },
  ];

  return (
    <div className='flex gap-[20px] my-2.5'>
      {/* Sử dụng map để lặp qua mảng và render mỗi MetricRadarChart */}
      {metrics.map((metric, index) => (
        <MetricRadarChart
          key={index}
          metricName={metric.metricName}
          title={metric.title}
          color={metric.color} 
        />
      ))}
    </div>
  );
};

export default Index;
