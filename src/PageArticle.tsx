import { logEvent } from "firebase/analytics";
import { addDoc, collection, deleteDoc, doc, DocumentReference, FieldPath, getDoc, onSnapshot, query, setDoc, Timestamp, where, documentId, orderBy } from "firebase/firestore";
import moment from "moment";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./Button";
import { FirebaseContext } from "./context";
import { capitalizeFirstLetter } from "./funcs";
import { FirestoreConverter, IComment, IEvent, INews, IUserProfile } from "./models";
import { Photo } from "./Photo";
import { RWebShare } from "react-web-share";
import { Event } from './Event';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Loader } from "./Loader";

export const PageArticle = () => {
    const params = useParams();
    const navigate = useNavigate();
    const commentRef = useRef<HTMLDivElement>(null);
    const { db, user, analytics, userProfile } = useContext(FirebaseContext);
    const [ article, setArticle ] = useState<INews | undefined>(undefined);
    const [ likes, setLikes ] = useState<string[]>([]);
    const [ comments, setComments ] = useState<IComment[]>([]);
    const [ commentsUsers, setCommentsUsers ] = useState<{[key: string] : IUserProfile}>({});
    const [ commentValue, setCommentValue ] = useState("");
    const [ shared, setShared ] = useState(0);
    const [ warnShown, setWarnShown ] = useState(false);
    const [ events, setEvents ] = useState<Set<IEvent>>(new Set());
    const [ loading, setLoading ] = useState(true);
    useEffect(() => {
        if (db) {
            return onSnapshot(doc(db, `/v2-news/${params.id}`), (snapshot) => {
                const d = { ...snapshot.data(), id: snapshot.id } as INews;
                setLoading(false);
                setArticle(d);
                if(d.events){
                    d.events.forEach((er) => getDoc(er).then((event) => setEvents(new Set([{ ...event.data(), id: event.id } as IEvent, ...Array.from(events)]))))
                }
            });
        }
    }, [db, params.id]);
    useEffect(() => {
        if (db) {
            return onSnapshot(collection(db, 'v2-news', params.id as string, 'shared'), (snapshot) => setShared(snapshot.docs.length));
        }
    }, [db, params.id]);
    useEffect(() => {
        if (db) {
            return onSnapshot(collection(db, 'v2-news', params.id as string, 'likes'), (snapshot) => setLikes(snapshot.docs.map((l) => l.id)));
        }
    }, [db, params.id]);
    useEffect(() => {
        if (db && comments.length > 0) {
            return onSnapshot(query(collection(db, 'v2-users'), where(documentId(), 'in', comments.map((c) => c.author))), (snapshot) => {
                let users = {} as {[key: string]: IUserProfile};
                snapshot.docs.forEach((d) => users[d.id] = d.data() as IUserProfile);
                setCommentsUsers(users);
            });
        }
    }, [db, comments]);
    useEffect(() => {
        if (db) {
            return onSnapshot(query(collection(db, 'v2-news', params.id as string, 'comments'), orderBy('date', 'desc')), (snapshot) => {
                setComments(snapshot.docs.map((l) => {
                    return { ...l.data(), id: l.id } as IComment;
                }));
            });
        }
    }, [db, params.id]);
    const pRef = useRef<HTMLDivElement>(null);
    return <div className="padding-x py-10">
        <Loader loading={loading} />
        { article ? 
        <div className="flex gap-10 flex-wrap justify-center">
            <div className="mb-10">
                <Photo src={article!.image} alt={article!.title} size='large' variant="square" />
                <div className="flex gap-10 justify-center mt-10">
                    <div className='flex gap-5'>
                        <p className='text-gray-500 text-lg'>{likes.length}</p>
                        <div className="cursor-pointer" onClick={() => {
                            if(user){
                                if(!(likes.indexOf(user.uid) >= 0)){
                                    console.log("Like!")
                                    setDoc(doc(db!, 'v2-news', params.id as string, 'likes', user!.uid as string), {
                                        date: Timestamp.now()
                                    });
                                }
                                else{
                                    console.log("Unlike")
                                    deleteDoc(doc(db!, 'v2-news', params.id as string, 'likes', user!.uid as string));
                                }
                            }
                        }}>
                            {
                                user && (likes.indexOf(user.uid) >= 0) ?
                                <i className="fa-solid fa-heart fa-2x text-[#01487C]"></i>
                                :
                                <i className="fa-regular fa-heart fa-2x text-[#01487C]"></i>
                            }
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <p className='text-gray-500 text-lg'>{comments.length}</p>
                        <i className="fa-solid fa-comment fa-2x text-[#01487C] cursor-pointer" onClick={() => commentRef.current?.scrollIntoView()}></i>
                    </div>
                    <div className="flex gap-5">
                        <p className='text-gray-500 text-lg'>{shared}</p>
                        <RWebShare
                            data={{
                                text: `Новость "${article.title}"`,
                                url: document.URL,
                                title: "Дорогою Добра"
                            }}
                            onClick={() => {
                                logEvent(analytics!, 'share', {
                                    content_type: 'article',
                                    content_id: params.id,
                                });
                                if(user)
                                    setDoc(doc(db!, 'v2-news', params.id as string, 'shared', user?.uid), {
                                        date: Timestamp.now()
                                    });
                            }}
                        >
                            <i className="fa-solid fa-share fa-2x text-[#01487C] cursor-pointer"></i>
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div>
                <div className='max-w-xl'>
                    <p className="text-lg text-gray-500">{capitalizeFirstLetter(article.date ? moment(article.date.toMillis()).fromNow() : 'Дата неизвестна')}</p>
                    <p className="text-4xl mt-3">{article!.title}</p>
                    {/* <p className="mt-7">{article!.description}</p> */}
                    { article!.description ? <div className="mt-7 appear space-y-5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article!.description.replaceAll('\\n', '\n\r')}</ReactMarkdown></div> : null }
                    <div className='pt-10'>
                        { Array.from(events).map((e) => <Event id={e.id} image={e.image} title={e.title} start={moment(e.start.toMillis()).format('hh:mm DD.MM.YY')} end={moment(e.end.toMillis()).format('hh:mm DD.MM.YY')} description={e.description} key={e.id}/>)}
                    </div>
                </div>
                <div className='w-full h-0.5 bg-gray-300 my-10'></div>
                {
                    user ? <div className="">
                        <p className="text-xl mb-5" ref={commentRef}>Поделитесь своим мнением</p>
                        <textarea className="border-[#01487C] border-[3px] w-full p-5" wrap='soft' value={commentValue} onChange={(ev) => {
                            setCommentValue(ev.target.value);
                            setWarnShown(false);
                        }}></textarea>
                        <div></div>
                        <div className='flex gap-5'>
                            <Button label="Отправить" onClick={() => {
                                if(commentValue.trim().length > 0){
                                    addDoc(collection(db!, 'v2-news', params.id as string, 'comments'), {
                                        author: user!.uid,
                                        date: Timestamp.now(),
                                        text: commentValue.trim()
                                    });
                                    setCommentValue("");
                                }
                                else{
                                    setWarnShown(true);
                                }
                            }}/>
                            {warnShown ? <p>Комментарий не может быть пустым</p> : null}
                        </div>
                    </div>
                    :
                    <div>
                        <p className="mb-5">Войдите в аккаунт для комментирования</p>
                        <Button label="Войти" onClick={() => navigate('/me')}/>
                    </div>
                }
                <div className="mt-10 space-y-5">
                    {
                        comments.length > 0 ?
                            <>
                                {comments.map((c) => commentsUsers[c.author] ? <div key={c.id}>
                                    <div className="flex gap-7">
                                        <div>
                                            <div className='cursor-pointer' onClick={() => navigate(`/user/${c.author}`)}>
                                                <Photo src={commentsUsers[c.author]!.avatar} size='small'/>
                                            </div>
                                            {user && c.author === user.uid ? <div className="flex justify-center mt-7 mb-3">
                                                    <i className="fa-solid fa-trash-can fa-lg text-gray-500 cursor-pointer" onClick={() =>{
                                                        deleteDoc(doc(db!, 'v2-news', params.id as string, 'comments', c.id as string));
                                                    }}></i>
                                                </div>
                                            : null}
                                        </div>
                                        <div className='space-y-5'>
                                            <div className="flex gap-5">
                                                <p className="text-xl max-w-lg">{commentsUsers[c.author]!.name}</p>
                                                <p className="text-gray-500">{c.date ? moment(c.date.toMillis()).fromNow() : null}</p>
                                            </div>
                                            <p className="max-w-xl">{c.text}</p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <p>Загрузка комментария</p>
                                </div>
                                )}
                            </>
                        :
                        <p>Нет комментариев</p>
                    }
                </div>
            </div>
        </div>
        : null }
    </div>
}