import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from './Button';
import { FirebaseContext } from './context';
import { Loader } from './Loader';
import { INews } from './models';
import { News } from './News';

export const PageNews = () => {
    const { db } = useContext(FirebaseContext);
    const [ news, setNews ] = useState<INews[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ shift, setShift ] = useState(12);
    useEffect(() => {
        if (db) {
            return onSnapshot(query(collection(db, '/v2-news'), limit(shift), orderBy('date', 'desc')), (snapshot) => {
                setNews(snapshot.docs.map((doc) => {
                    setLoading(false);
                    return {...doc.data(), id: doc.id} as INews;
                }));
            });
        }
    }, [db, shift]);
    return <div>
        <Loader loading={loading} />
        <div className='text-center py-10'>
            <p className="text-4xl mb-5">Новости</p>
            <p className="text-lg">Наши новости</p>
        </div>
        <div className='padding-x flex flex-wrap gap-10 justify-center'>
            {news.map((item) => <News key={item.id} id={item.id} image={item.image} title={item.title} description={item.description?.slice(0, 100) + (item.description && item.description.length > 100 ? '...' : '')} date={moment(item.date.toMillis()).fromNow()} />)}
        </div>
        <div className="py-10 flex justify-center">
            <Button label='Загрузить ещё' onClick={() => setShift(shift + 12)}/>
        </div>
    </div>
}