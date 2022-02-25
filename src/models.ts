import { DocumentReference, GeoPoint, Timestamp } from "firebase/firestore";

export interface IVideo {
    id: string,
    url: string,
    title?: string,
    description?: string
}

export interface INews{
    id: string,
    image: string,
    date: Timestamp,
    title?: string,
    description?: string,
    events?: DocumentReference[]
}

export interface IUserProfile{
    name: string,
    bio: string,
    avatar: string
}

export interface IUserBadge{
    image: string,
    title: string,
    id: string;
    description?: string;
}

export interface IComment{
    id: string;
    author: string
    date: Timestamp;
    text: string;
}

export interface IEvent{
    id: string;
    start: Timestamp;
    end: Timestamp;
    title?: string;
    description?: string;
    geopoint?: GeoPoint;
    image?: string;
}

export interface IBigCalendarEvent{
    start?: Date;
    end?: Date;
    title?: string;
}

export const FirestoreConverter = {
    toUserProfile (data: any): IUserProfile {
        return {
            name: data.name,
            avatar: data.avatar,
            bio: data.bio
        }
    }
}

export const BigCalendarConverter = {
    toBigCalendarEvent (event: IEvent): IBigCalendarEvent {
        return {
            start: event.start.toDate(),
            end: event.end.toDate(),
            title: event.title
        }
    }
}