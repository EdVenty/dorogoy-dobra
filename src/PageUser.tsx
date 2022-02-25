import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "./Badge";
import { BadgeCard } from "./BadgeCard";
import { Button } from "./Button";
import { FirebaseContext } from "./context";
import { Loader } from "./Loader";
import { IUserBadge, IUserProfile } from "./models";
import { Photo } from "./Photo";
import { TextBlock } from "./TextBlock";


export const PageUser = () => {
    const navigate = useNavigate();
    const { db, user } = useContext(FirebaseContext);
    const [ profile, setProfile ] = useState<IUserProfile | undefined>(undefined);
    const [ badges, setBadges ] = useState<IUserBadge[]>([]);
    const [ loading, setLoading ] = useState(true);
    const params = useParams();
    useEffect(() => {
        if(user && user.uid === params.id){
            navigate('/me');
        }
    }, [user, params.id])
    useEffect(() => {
        console.log(`Getting ${params.id}`);
        return onSnapshot(doc(db!, 'v2-users', params.id as string), (snapshot) => {
            setProfile(snapshot.data() as IUserProfile);
            setBadges(snapshot.data()!.badges as IUserBadge[]);
            setLoading(false);
        });
    }, [params.id]);
    // useEffect(() => {
    //     return onSnapshot(collection(db!, 'v2-users', params.id as string, 'badges'), (snapshot) => setBadges(snapshot.docs.map((d) => {
    //         return { ...d.data(), id: d.id } as IUserBadge;
    //     })));
    // }, [params.id]);
    return <div className="py-10">
        <Loader loading={loading} />
        { profile ?
        <div className=''>
            <div className="flex gap-10 flex-wrap padding-x">
                <div className="mb-10">
                    <Photo src={profile.avatar} size="large"/>
                    {/* <div className="-translate-y-full translate-x-80 absolute flex justify-between">
                        <div className="w-20 h-20 bg-[#01487C] rounded-full -translate-x-1/4 -translate-y-1/4"></div>
                    </div> */}
                </div>
                <div>
                    <div className='flex mb-7 gap-5'>
                        {badges?.map((b) => <Badge key={b.id} image={b.image} size='middle' title={b.title}/>)}
                    </div>
                    <TextBlock className="text-4xl mb-7" defaultValue={profile.name} editable={false}/>
                    <p className="text-gray-500">О себе:</p>
                    <TextBlock className="text-lg" defaultValue={profile.bio.length > 0 ? profile!.bio : "Нет биографии"} editable={false}/>
                </div>
            </div>
            <div className="bg-gray-200 padding-x mt-5">
                <div className='text-center pt-5 pb-10'>
                    <p className="text-4xl mb-5">Значки</p>
                    <p className="text-lg">Коллекционные значки пользователя</p>
                </div>
                <div className="flex justify-center flex-wrap gap-10 pb-10">
                    { badges ? badges.map((b) => <BadgeCard id={b.id} title={b.title} description={b.description ? b.description : `Пользователь получил значок "${b.title}"`} image={b.image} key={b.id} />) : null}
                </div>
            </div>
        </div>
        : null }
    </div>
}