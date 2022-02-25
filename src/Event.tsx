import { addDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useContext } from "react";
import { FirebaseContext } from "./context";
import { Photo } from "./Photo";

interface EventProps {
    image?: string;
    title?: string;
    description?: string;
    start?: string;
    end?: string;
    id: string
}

export const Event = ({
    id,
    ...props
}: EventProps) => {
    const { db, user } = useContext(FirebaseContext);
    return <div className="flex justify-between transition-all hover:translate-x-5">
        <div className='flex gap-10'>
            { props.image ? <Photo src={props.image} size={'small'} /> : null}
            <div>
                <p className='text-2xl'>{props.title}</p>
                <p className='text-lg'>{props.description}</p>
                <p className='text-gray-500'>{props.start} - {props.end}</p>
            </div>
        </div>
        {/* <div className='flex flex-col justify-center'>
            <i className="fa-solid fa-user-plus fa-2x text-[#01487C] cursor-pointer" onClick={() => setDoc(doc(db!, 'v2-users', user?.uid as string, 'ps', id), {})}></i>
        </div> */}
    </div>
}