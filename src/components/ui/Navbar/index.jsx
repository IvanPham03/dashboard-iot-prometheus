import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import logoTGL from '../../../assets/images/logo-tgl.svg'
import logo from '../../../assets/images/logo.png'
const index = () => {
    return (
        <div className='flex justify-between items-center h-[60px] bg-red gap-[100px] px-[20px] my-[10px]'>
            <a href="/"> <img src={logoTGL} alt="logo TGL" className='h-[40px]' /></a>
            <div className='border hover:scale-[101%] transition h-[40px] flex flex-row justify-between items-center rounded-full grow px-[20px] drop-shadow-xl' style={{ boxShadow: '1px 10px 10px rgba(0, 0, 0, 0.1)' }}>
                <input type="text" id='search' autoComplete='off' className='bg-transparent outline-0 border-0 font-[24px] w-full mr-[10px]' placeholder='Search or jump to ....' />
                <label htmlFor="search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </label>

            </div>
            <div className='flex space-x-2 items-center'>
                <img src={logo} alt="logo.png" className='w-[40px] h-[40px] drop-shadow-xl' />
                <p>
                    Pham Dang Truong
                </p>
                <FontAwesomeIcon icon={faChevronDown} className='h-[40px] w-[40px]' style={{ height: '25px', width: '25px' }} />
            </div>
        </div>
    )
}

export default index
