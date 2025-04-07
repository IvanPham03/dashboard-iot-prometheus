import React from 'react'
import TimeSeries from './TimeSeries.jsx'
import Usage from './Usage.jsx'
const Index = () => {
    return (
        <div className='flex gap-[20px] my-2.5'>
            <Usage />
            <TimeSeries />
        </div>
    )
}

export default Index
