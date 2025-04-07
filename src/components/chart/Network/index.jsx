import React from 'react'
import NetworkBarChart from './NetworkBarChart'

const metrics = [
  {
    metricName: 'net_conntrack_listener_conn_accepted_total',
    color: '#0000FF',
    title: 'Connections opened',
  },
  {
    metricName: 'net_conntrack_listener_conn_closed_total',
    color: '#FF0000',
    title: 'Connections closed',
  },
]

const Index = () => {
  return (
    <div className="w-full my-2.5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <NetworkBarChart
            key={metric.metricName}
            metricName={metric.metricName}
            color={metric.color}
            title={metric.title}
          />
        ))}
      </div>
    </div>
  )
}

export default Index
