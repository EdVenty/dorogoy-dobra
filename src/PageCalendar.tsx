import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Loader } from './Loader';
import { Event } from './Event';
import moment from 'moment';
import { BigCalendarConverter, IEvent } from './models';
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { FirebaseContext } from './context';

const localizer = momentLocalizer(moment);

export const PageCalendar = () => {
    const { db } = useContext(FirebaseContext);
    const [ loading, setLoading ] = useState(true);
    const [ events, setEvents ] = useState<IEvent[]>([]);
    useEffect(() => {
        if (db) {
            return onSnapshot(query(collection(db, '/v2-events'), where('end', '>=', Timestamp.now()), orderBy('end', 'desc')), (snapshot) => {
                setLoading(false) 
                setEvents(snapshot.docs.map((doc) => {
                    return {...doc.data(), id: doc.id} as IEvent;
                }))
            });
        }
    }, [db]);
    return <div>
        <Loader loading={loading} />
        <div className='padding-x'>
            <div className='text-center py-10'>
                <p className="text-4xl mb-5">Календарь</p>
                <p className="text-lg">Мероприятия</p>
            </div>
            <div className='mb-10 space-y-5'>
                { events.map((e) => <Event id={e.id} image={e.image} title={e.title} start={moment(e.start.toMillis()).format('hh:mm DD.MM.YY')} end={moment(e.end.toMillis()).format('hh:mm DD.MM.YY')} description={e.description} key={e.id}/>)}
                { events.length <= 0 ? <p>Нет запланированных мероприятий</p> : null}
            </div>
            <div className="mb-10">
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
        </div>
    </div>
}