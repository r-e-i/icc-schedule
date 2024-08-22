import React from 'react';
interface Props {
    children: React.ReactNode;
}

export default function Title(props: Props) {
    return (
        <div className="w-full bg-yellow-800 text-white object-cover z-10 rounded-lg m-1">
            <div className='text-center text-xl tracking-widest'>{props.children}</div>
        </div>
    );
}
