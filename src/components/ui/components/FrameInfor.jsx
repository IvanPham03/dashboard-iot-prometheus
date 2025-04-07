import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

// Hàm xử lý key để chuyển từ dạng snake_case hoặc có dấu gạch dưới thành dạng đẹp
const formatKey = (key) => {
    // Xử lý key để thay thế _ thành khoảng trắng và chuyển chữ cái đầu thành chữ hoa
    return key
        .replace(/_/g, ' ')  // Thay _ bằng khoảng trắng
        .replace(/\b\w/g, (char) => char.toUpperCase());  // Chuyển chữ cái đầu của mỗi từ thành chữ hoa
}

const FrameInfor = props => {
    return (
        <div className='border rounded-lg flex-grow p-[8px]' style={{ boxShadow: '1px 10px 10px rgba(0, 0, 0, 0.1)' }}>
            <p className='text-left'>
                {formatKey(props.data["key"])} <FontAwesomeIcon icon={faCircleExclamation} />
            </p>
            <p className='text-center'>
                {props.data["value"]}
            </p>
        </div>
    )
}

export default FrameInfor;
