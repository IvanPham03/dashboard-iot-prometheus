import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Container = ({ title = 'Null Title', Children }) => {
    return (
        <div className=''>
            <p className='text-[18px] flex items-center'>
                {title}
                <FontAwesomeIcon icon={faCaretDown} className='ml-[5px] h-[20px]' />
            </p>

            <div className='p-2 rounded-md'>
                {Children ? <Children /> : "No children provided."}
            </div>
        </div>
    );
};

export default Container;
