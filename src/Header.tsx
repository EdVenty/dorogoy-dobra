import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

const routes: {path: string, title: string, imp?: boolean}[] = [
    {
        path: '/',
        title: 'Главная'
    },
    {
        path: '/news',
        title: 'Новости'
    },
    {
        path: '/calendar',
        title: 'Календарь'
    },
    {
        path: '/me',
        title: 'Аккаунт',
        imp: true
    }
]

export const Header = () => {
    const navigate = useNavigate();
    return <div className='p-5 flex justify-between'>
        <div className="flex cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="" className='h-10 mr-5'/>
            <h2 className='text-xl'>Дорогой добра</h2>
        </div>
        <div className="flex gap-7">
            { routes.map((route) => <p onClick={() => navigate(route.path)} className={['cursor-pointer', !route.imp ? 'not-imp' : null].filter((v) => v !== null).join(' ')}>{route.title}</p>) }
        </div>
    </div>
}