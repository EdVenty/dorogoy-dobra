import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import './App.css';
import { PageHome } from './PageHome';
import { Header } from './Header';
import { FirebaseContext } from './context';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import moment from 'moment';
import 'moment/locale/ru';  // without this line it didn't work

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, doc, enableIndexedDbPersistence, getDoc, getFirestore, onSnapshot, query, setDoc } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { IUserBadge, IUserProfile } from './models';
import { PageMe } from './PageMe';
import { PageArticle } from './PageArticle';
import { PageUser } from './PageUser';
import { getStorage } from "firebase/storage";
import { getPerformance, trace } from "firebase/performance";
import { PageClose } from './PageClose';
import { PageNews } from './PageNews';
import { Page404 } from './Page404';
import { PageCalendar } from './PageCalendar';
moment.locale('ru');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEkMmRttZeYHc6agXVRTjfFr2KLQI2XsA",
  authDomain: "dd-asia.firebaseapp.com",
  projectId: "dd-asia",
  storageBucket: "dd-asia.appspot.com",
  messagingSenderId: "256048594049",
  appId: "1:256048594049:web:ada7a2bda342777439a180",
  measurementId: "G-SL6D3XB4PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth();
const storage = getStorage();
var ui = new firebaseui.auth.AuthUI(auth);
const perf = getPerformance(app);

var closeDialog = false;

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          closeDialog = true;
          console.log("Multiple tabs open. Close all except one");
      } else if (err.code === 'unimplemented') {
        console.log("Your browser does not support indexed DB");
      }
});

function App() {
  const [ user, setUser ] = useState<User | null>(null);
  const [ userProfile, setUserProfile ] = useState<IUserProfile | undefined>(undefined);
  const [ userBadges, setUserBadges ] = useState<IUserBadge[]>([]);
  useEffect(() => {
    auth.onAuthStateChanged((user_) => {
      setUser(user_);
      if(user_){
        getDoc(doc(db!, `/v2-users/${user_.uid}`))
        .then((doc_) => {
          if (!doc_.exists().valueOf()){
            console.log("New profile");
            setDoc(doc(db!, `/v2-users/${user_.uid}`), {
              name: user_!.displayName,
              avatar: user_!.photoURL,
              bio: ""
            } as IUserProfile);
          }
        });
      }
      else{
        setUserProfile(undefined);
      }
    });
  }, []);
  useEffect(() => {
    if (user) {
      return onSnapshot(doc(db, `/v2-users/${user?.uid}`), (snapshot) => {
        setUserProfile(snapshot.data() as IUserProfile);
        setUserBadges(snapshot.data()!.badges as IUserBadge[]);
      });
    }
  }, [user]);
  // useEffect(() => {
  //   if (user) {
  //     return onSnapshot(collection(db, `/v2-users/${user?.uid}/badges`), (snapshot) => setUserBadges(snapshot.docs.map((d) => { 
  //       return {...d.data(), id: d.id} as IUserBadge;
  //     })));
  //   }
  // }, [user]);
  return <div>
    {!closeDialog ? 
      <FirebaseContext.Provider value={{
        app,
        analytics,
        db,
        auth,
        ui,
        user,
        userProfile,
        userBadges,
        storage,
        perf
      }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/news" element={<PageNews />} />
            <Route path="/article">
              <Route path="/article/:id" element={<PageArticle />} />
            </Route>
            <Route path="/user">
              <Route path="/user/:id" element={<PageUser />} />
            </Route>
            <Route path="/" element={<PageHome />} />
            <Route path="/me" element={<PageMe />} />
            <Route path="/calendar" element={<PageCalendar />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>
      </FirebaseContext.Provider>
    : <PageClose />
    }
  </div>
}

export default App;
