import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './news.css';
import ReactMarkdown from 'react-markdown';
import { FirebaseContext } from './context';
import { getDownloadURL, ref } from 'firebase/storage';

interface NewsProps{
    id?: string,
    image: string;
    alt?: string | undefined;
    date?: string;
    title?: string;
    description?: string
}

export const News = ({
    title = "",
    description = "",
    date = "",
    alt = undefined,
    image,
    id = ""
}: NewsProps) => {
    const { storage } = useContext(FirebaseContext);
    const navigate = useNavigate();
    const alternative = alt ? alt : title;
    const realImage = image ? (image.startsWith('http') ? image : `https://firebasestorage.googleapis.com/v0/b/dd-asia.appspot.com/o/${image.replace('/', '%2F')}?alt=media`) : undefined;
    return <div className="news-container transition hover:-translate-y-5 cursor-pointer overflow-hidden" onClick={() => navigate(`/article/${id}`)}>
        <img src={realImage} alt={alternative} className="news-image"/>
        <p className="text-2xl mt-5">{title}</p>
        <p className="news-date text-gray-500">{date}</p>
        {/* <p className="news-description text-lg text-clip">{description}</p> */}
        <div className='news-description text-lg h-full'><ReactMarkdown>{description.replaceAll('\\n', ' ').replaceAll('\n', ' ')}</ReactMarkdown></div>
    </div>
}