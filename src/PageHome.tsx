import React, { Fragment, useContext, useEffect, useState } from 'react';
import bin from './bin.svg';
import { Button } from './Button';
import { Photo } from './Photo';
import { VideoCarousel } from './VideoCarousel';
import { News } from './News';
import { FirebaseContext } from './context';
import { doc, getDocs, query, collection, onSnapshot, getDoc, addDoc, setDoc, limit, orderBy, Timestamp, where } from 'firebase/firestore';
import { INews, IVideo, IUserProfile, IEvent, BigCalendarConverter } from './models';
import moment from 'moment';
import { logEvent } from 'firebase/analytics';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event } from './Event';
import { Loader } from './Loader';

const localizer = momentLocalizer(moment);

const events_ = [
    {
      start: moment().toDate(),
      end: moment()
        .add(1, "days")
        .toDate(),
      title: "Some title"
    }
]

export const PageHome = () => {
    const navigate = useNavigate();
    const { db, ui, user, auth, analytics } = useContext(FirebaseContext);
    const [ videos, setVideos ] = useState<IVideo[]>([]);
    const [ news, setNews ] = useState<INews[]>([]);
    const [ events, setEvents ] = useState<IEvent[]>([]);
    const [ eventsLoading, setEventsLoading ] = useState(true);
    const [ videosLoading, setVideosLoading ] = useState(true);
    const [ newsLoading, setNewsLoading ] = useState(true);
    useEffect(() => {
        if (db) {
            return onSnapshot(query(collection(db, '/v2-videos'), limit(6), orderBy('date', 'desc')), (snapshot) => {
                setVideos(snapshot.docs.map((doc) => {
                    setVideosLoading(false);
                    return {...doc.data(), id: doc.id} as IVideo;
                }));
            });
        }
    }, [db]);
    useEffect(() => {
        if (db) {
            return onSnapshot(query(collection(db, '/v2-news'), limit(3), orderBy('date', 'desc')), (snapshot) => {
                setNews(snapshot.docs.map((doc) => {
                    setNewsLoading(false);
                    return {...doc.data(), id: doc.id} as INews;
                }));
            });
        }
    }, [db]);
    useEffect(() => {
        if (db) {
            return onSnapshot(query(collection(db, '/v2-events'), where('end', '>=', Timestamp.now()), orderBy('end', 'desc')), (snapshot) => {
                setEventsLoading(false);
                setEvents(snapshot.docs.map((doc) => {
                    return {...doc.data(), id: doc.id} as IEvent;
                }));
            });
        }
    }, [db]);
    return <div>
            <Loader loading={eventsLoading || newsLoading || videosLoading} />
            <div className="flex justify-between padding-x py-20">
            <div className="flex flex-col justify-between">
                <div className="mb-5">
                    <p className="text-5xl mb-5">Дорогой добра</p>
                    <p className="text-xl text-gray-600 mb-5">Благотворительный проект Гимназии ДВФУ</p>
                    <p className="text-xl text-gray-600 italic">Иди, мой друг, всегда иди дорогою добра! - Юрий Энтин</p>
                </div>
                {/* <Button label="Узнать больше" primary={true} size='large' onClick={() => logEvent(analytics!, "check_section", {
                    content_type: 'main'
                })}/> */}
                <div className='flex gap-5 text-[#01487C] fa-3x'>
                    <i className="fa-brands fa-instagram cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'instagram'
                        });
                        window.location.href = 'https://www.instagram.com/kaleidoscope_ddo/';
                    }}></i>
                    <i className="fa-brands fa-facebook cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'facebook'
                        });
                        window.location.href = 'https://www.facebook.com/kaleidoscope_ddo-105990414456061';
                    }}></i>
                    <i className="fa-brands fa-vk cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'vk'
                        });
                        window.location.href = 'https://vk.com/club194102134';
                    }}></i>
                    <i className="fa-brands fa-telegram cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'telegram'
                        });
                        window.location.href = 'https://t.me/+xv1ihtbMrPE3ZDE6';
                    }}></i>
                </div>
            </div>
            {/* <img src={bin} alt="" className="w-200 not-imp"/> */}
            <div className='grid grid-cols-2 w-[30rem] gap-2'>
                <img src="https://sun9-76.userapi.com/impg/EpjDV1iy99CJBnFUXfKBnMmdr8_j6YvwTaiqUA/Ob8YZH5VuMU.jpg?size=1080x1080&quality=96&sign=b369b60c04758600af04d30fcbfd0eea&type=album" alt="" className='rounded-2xl'/>
                <img src="https://sun9-80.userapi.com/impg/9u9b6jp2TyarVyb8E8lGGQ4hweL3EcPB21NZBQ/NuOneqXeo9I.jpg?size=1080x1080&quality=96&sign=ad9f80642212cec97dbfb3c2c8784414&type=album" alt="" className='rounded-2xl'/>
                <img src="https://sun9-30.userapi.com/impg/nD-cfqHx7peRCOQXSfZThVJCSGf8lfaMQOGKKw/wWgFWrdoQKY.jpg?size=1080x1080&quality=96&sign=593c0d2dd063f2364cc0551117669052&type=album" alt="" className='rounded-2xl'/>
                <img src="https://sun9-28.userapi.com/impg/vqXHOwd1kCS4Oz_Xl-5kXAW3mH20a9SdrEC-cw/E4cI2d6nvKw.jpg?size=1080x1080&quality=96&sign=6e246c1316b8f21ceb5532807e7784f2&type=album" alt="" className='rounded-2xl'/>
            </div>
        </div>
        {/* <div className="padding-x py-20 gap-7 flex flex-wrap justify-center">
            <div>
                <div className='w-fit'>
                    <Photo size='large' src='https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80' />
                    <div className="-translate-y-full flex justify-between">
                        <div className="opacity-50 w-36 h-36 bg-[#01487C] rounded-full"></div>
                        <div className="flex flex-col justify-end">
                            <div className="w-20 h-20 bg-[#01487C] rounded-full -translate-x-1/4 -translate-y-1/4"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-xl">
                <div className="mb-5">
                    <p className="text-3xl mb-5">Наша миссия</p>
                    <p>Спешите делать добро!</p>
                </div>
            </div>
        </div> */}
        <div className="bg-gray-200 px-10 pb-10">
            <div className='text-center py-10'>
                <p className="text-4xl mb-5">Видео</p>
                <p className="text-lg">Смотрите видео с наших мероприятий здесь</p>
            </div>
            <div className='flex justify-center'>
                <VideoCarousel videos={videos.map((video) => {
                    return {
                        id: video.id,
                        src: video.url,
                        title: video.title,
                        description: video.description
                    }
                })} startAt={0}/>
            </div>
        </div>
        <div>
            <div className='text-center py-10'>
                <p className="text-4xl mb-5">Новости</p>
                <p className="text-lg">Наши новости</p>
            </div>
            <div className='padding-x flex flex-wrap gap-10 justify-center'>
                {news.map((item) => <News key={item.id} id={item.id} image={item.image} title={item.title} description={item.description?.slice(0, 100) + (item.description && item.description.length > 100 ? '...' : '')} date={moment(item.date.toMillis()).fromNow()} />)}
            </div>
            <div className="flex justify-center p-10">
                <Button label='Подробнее' onClick={() => {
                    logEvent(analytics!, "check_section", {
                        content_type: 'news'
                    });
                    navigate('/news');
                }}/>
            </div>
        </div>
        <div className='bg-gray-200 px-10'>
            <div className='text-center py-10'>
                <p className="text-4xl mb-5">Заинтересованы?</p>
                <p className='mb-7'>Создайте аккаунт</p>
                <Button label="Регистрация или вход" onClick={() => navigate('/me')}/>
            </div>
        </div>
        <div className='padding-x'>
            <div className='text-center py-10'>
                <p className="text-4xl mb-5">Календарь</p>
                <p className="text-lg">Мероприятия</p>
            </div>
            <div className='mb-10 space-y-5'>
                { events.map((e) => <Event id={e.id} image={e.image} title={e.title} start={moment(e.start.toMillis()).format('hh:mm DD.MM.YY')} end={moment(e.end.toMillis()).format('hh:mm DD.MM.YY')} description={e.description} key={e.id}/>)}
                { events.length <= 0 ? <p>Нет запланированных мероприятий</p> : null}
            </div>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events.map((e) => BigCalendarConverter.toBigCalendarEvent(e))}
                    startAccessor="start"
                    endAccessor="end"
                    messages={{
                        next: "Вперёд",
                        previous: "Назад",
                        today: "Сегодня",
                        month: "Месяц",
                        week: "Неделя",
                        day: "День",
                    }}
                    views={['month', 'day', 'week']}
                    defaultView={'week'}
                />
            </div>
            <div className="flex justify-center p-10">
                <Button label='Подробнее' onClick={() => {
                    logEvent(analytics!, "check_calendar", {
                        content_type: 'video'
                    });
                    navigate('/calendar');
                }}/>
            </div>
        </div>
        <div className='bg-gray-200 px-10'>
            <div className='text-center py-10'>
                <p className="text-4xl mb-5">Дорогой добра</p>
                <div className='flex gap-5 text-[#01487C] fa-3x justify-center mb-5'>
                    <i className="fa-brands fa-instagram cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'instagram'
                        });
                        window.location.href = 'https://www.instagram.com/kaleidoscope_ddo/';
                    }}></i>
                    <i className="fa-brands fa-facebook cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'facebook'
                        });
                        window.location.href = 'https://www.facebook.com/kaleidoscope_ddo-105990414456061';
                    }}></i>
                    <i className="fa-brands fa-vk cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'vk'
                        });
                        window.location.href = 'https://vk.com/club194102134';
                    }}></i>
                    <i className="fa-brands fa-telegram cursor-pointer" onClick={() => {
                        logEvent(analytics!, 'social_redirect', {
                            service: 'telegram'
                        });
                        window.location.href = 'https://t.me/+xv1ihtbMrPE3ZDE6';
                    }}></i>
                </div>
                {/* <p className="transition-all hover:text-[#01487C]">UI разработан Edventy</p> */}
            </div>
        </div>
    </div>
}