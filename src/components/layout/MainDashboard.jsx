import React from 'react'
import Navbar from '../ui/Navbar'
import Info from '../ui/Infor'
import Container from '../ui/components/Container'
import Memory from '../chart/Memory'
import Network from '../chart/Network/index.jsx';
import Process from '../chart/Process_CPU'
import PrometheusServer from '../chart/Prometheus_Server/PrometheusServer.jsx'
import GC from '../chart/GarbageCollection'
const MainDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className='m-[20px]'>
        <Info />
        <Container title={'CPU'} Children={Process} />
        <Container title={"Memory"} Children={Memory} />
        <Container title={"Network"} Children={Network} />
        <Container title={"Prometheus Server"} Children={PrometheusServer} />
        <Container title={"Prometheus Http"} Children={GC} />
      </div>

    </div>
  )
}

export default MainDashboard
