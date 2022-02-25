import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { FirebaseContext } from "./context";
import { Photo } from "./Photo";
import { TextBlock } from "./TextBlock";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { TailSpin } from  'react-loader-spinner';
import { Loader } from "./Loader";
import { BadgeCard } from "./BadgeCard";

const filterBySize = (file: any) => {
    //filter out images larger than 5MB
    return file.size <= 5242880;
};

export const PageMe = () => {
    const { userProfile, user, ui, auth, db, userBadges, storage } = useContext(FirebaseContext);
    const fileRef = useRef<HTMLInputElement>(null);
    const [ fileWarn, setFileWarn ] = useState(false);
    const [ uploading, setUploading ] = useState(false);
    useEffect(() => {
        if(ui && !user){
            const uiConfig = {
                callbacks: {
                  signInSuccessWithAuthResult: function(authResult: any, redirectUrl: any) {
                    return false;
                  },
                  uiShown: function() {
                    console.log("UI shown");
                  }
                },
                signInFlow: 'popup',
                signInOptions: [
                  GoogleAuthProvider.PROVIDER_ID,
                  EmailAuthProvider.PROVIDER_ID,
                ],

            } as firebaseui.auth.Config;
            let fui = document.getElementById('#firebaseui-auth-container');
            if (fui)
                fui.style.display = 'inherit';
            ui.start('#firebaseui-auth-container', uiConfig);
        }
        else if(user && userProfile){
            let fui = document.getElementById('#firebaseui-auth-container');
            if (fui)
                fui.style.display = 'none';
        }
    }, [ui, user, userProfile]);
    if(userProfile && user){
        return <div className="py-10">
            <Loader loading={false}/>
            <div className="flex gap-10 flex-wrap padding-x justify-center">
                <div className="mb-10">
                    <div>
                        <Photo src={userProfile!.avatar} size="large"/>
                        {/* <div className="-translate-y-full translate-x-80 absolute flex justify-between not-imp">
                            <div className="w-20 h-20 bg-[#01487C] rounded-full -translate-x-1/4 -translate-y-1/4"></div>
                        </div> */}
                    </div>
                    <div className="flex justify-center my-5">
                    {uploading ? 
                        <TailSpin color="#01487C" height={80} width={80} /> :
                        <Button label="Изменить аватар" onClick={() => fileRef.current?.click()}/>}
                    </div>
                    {fileWarn ? <p>Размер файла превышает 5 мб</p> : null}
                    <input type='file' accept=".jpg, .jpeg, .png, .gif" ref={fileRef} onChange={(e) => {
                        if(user && e.target.files && e.target.files?.length > 0){
                            if(e.target.files[0].size < 5 * 1024 * 1024){
                                const reff = ref(storage!, `v2/images/avatars/${user.uid}-${Date.now()}`);
                                setUploading(true);
                                uploadBytes(reff, e.target.files[0]).then((snapshot) => {
                                    console.log('Uploaded a blob or file!');
                                    getDownloadURL(reff).then((s) => {
                                        setUploading(false)
                                        updateDoc(doc(db!, 'v2-users', user.uid), {
                                            avatar: s
                                        });
                                    })
                                });
                            }
                            else{
                                setFileWarn(true);
                            }
                        }
                    }} className="hidden"/>
                </div>
                <div>
                    <div className='flex mb-7 gap-5'>
                        {userBadges?.slice(0, 4).map((b) => <Badge key={b.id} image={b.image} size='middle' title={b.title}/>)}
                    </div>
                    <TextBlock className="text-4xl mb-7" defaultValue={userProfile.name} onSet={(value) => updateDoc(doc(db!, 'v2-users', user.uid), {
                        name: value
                    })}/>
                    <p className="text-gray-500">О себе:</p>
                    <TextBlock className="text-lg" defaultValue={userProfile.bio.length > 0 ? userProfile!.bio : "Нет биографии"} onSet={(value) => {
                        updateDoc(doc(db!, 'v2-users', user.uid), {
                            bio: value
                        });
                    }} />
                    <div className={user ? "flex justify-start pt-10" : "hidden"}>
                        <Button onClick={() => {
                            console.log("Sign out");
                            auth?.signOut();
                        }} label="Выйти" />
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 padding-x mt-5">
                <div className='text-center pt-10 pb-10'>
                    <p className="text-4xl mb-5">Значки</p>
                    <p className="text-lg">Коллекционные значки пользователя</p>
                </div>
                <div className="flex justify-center flex-wrap gap-10 pb-10">
                    { userBadges ? userBadges.map((b) => <BadgeCard id={b.id} title={b.title} description={b.description ? b.description : `Пользователь получил значок "${b.title}"`} image={b.image} key={b.id} />) : null}
                </div>
            </div>
        </div>
    }
    else{
        return <div className='padding-x py-10 text-center'>
            <p className='text-4xl mb-7'>Ваш аккаунт</p>
            <p className="text-xl mb-14">Войдите для продолжения</p>
            <div className={user ? 'hidden' : ''}>
                <div id='firebaseui-auth-container' className={user ? 'hidden' : ''}></div>
            </div>
        </div>
    }
}