import React, { useRef, useState, useEffect } from 'react';
import { Video } from './Video';
import arrow from './right-arrow.png';
import './videoCarousel.css';

interface CarouselProps{
    startAt?: number,
    videos: {
        id: string,
        src: string,
        title?: string,
        description?: string
    }[]
}

export const VideoCarousel = ({
    startAt = 0,
    videos
}: CarouselProps) => {
    const [ slide, setSlide ] = useState(startAt);
    const [ transform , setTransform ] = useState('0px');
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(ref.current){
            setTransform(`translateX(${(slide) * -680 + (Number(ref.current?.offsetWidth) - 640) / 2}px)`);
        }
    }, [slide, videos]);
    return <div>
        <div className="flex flex-row h-[360px]">
            <div className="flex flex-col justify-center w-52">
                <div className='w-full flex justify-center'>
                    <i className="fa-solid fa-angle-left cursor-pointer fa-5x text-[#01487C]" onClick={() => setSlide(slide - 1 >= 0 ? (slide - 1) % videos.length : videos.length - 1)}></i>
                </div>
            </div>
            <div className="flex flex-row overflow-hidden" ref={ref}>
                {videos.map((child, i) => <div key={i} className="slide" style={{marginTop: `${i === slide  ? 0 : 30}px`, transform: transform, marginLeft: '10px', marginRight: '10px'}}>
                        <Video key={child.id} src={child.src} title={child.title} description={child.description} height={i === slide  ? 360 : 300} playing={i === slide}/>
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center w-52">
                <div className='w-full flex justify-center'>
                    <i className="fa-solid fa-angle-right cursor-pointer fa-5x text-[#01487C]" onClick={() => setSlide((slide + 1) % videos.length)}></i>
                </div>
            </div>
        </div>
    </div>
}