import React, { useEffect, useState } from "react";
import { Triangle } from  'react-loader-spinner';
import { Header } from "./Header";
import logo from './logo.png';

interface LoaderProps{
    loading?: boolean,
    showForeAfter?: number,
    maxDuration?: number
}

export const Loader = ({
    loading = true,
    showForeAfter = 500,
    maxDuration = 5000
}: LoaderProps) => {
    const [ start, setStart ] = useState(Date.now());
    useEffect(() => {
        setStart(Date.now());
    }, [loading]);
    return <div className='fixed z-50 bg-white pointer-events-none top-0 left-0 w-screen h-screen transition-all' style={{opacity: (loading && Date.now() <= (start + maxDuration)) ? 100 : 0}}>
        <div className="flex cursor-pointer pl-5 pt-5">
            <img src={logo} alt="" className='h-10 mr-5'/>
            <h2 className='text-xl'>Дорогой добра</h2>
        </div>
        <div className="flex justify-center">
            <div className='transition-all flex flex-col justify-center h-screen' style={{opacity: loading && Date.now() - start > showForeAfter ? 100 : 0}}>
                <Triangle height={80} width={80} color='#01487C'/>
            </div>
        </div>
</div>
}