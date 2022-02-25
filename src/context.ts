import React, { createContext } from 'react';
import { Analytics } from "firebase/analytics"
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { FirebaseStorage } from 'firebase/storage';
import { Auth, User } from 'firebase/auth';
import * as firebaseui from "firebaseui";
import { IUserBadge, IUserProfile } from './models';
import { FirebasePerformance } from 'firebase/performance';

export interface IFirebaseContext{
    analytics?: Analytics,
    db?: Firestore,
    app?: FirebaseApp,
    auth?: Auth,
    ui?: firebaseui.auth.AuthUI,
    user: User | null,
    userProfile?: IUserProfile,
    userBadges?: IUserBadge[],
    storage?: FirebaseStorage,
    perf?: FirebasePerformance;
}

export const FirebaseContext = createContext<IFirebaseContext>({
    user: null
});