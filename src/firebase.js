import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const auth = firebase.initializeApp({
  apiKey: "AIzaSyDLPTDnPCnD4iEty4SdULz0IRLwr72PNTQ",
  authDomain: "messaging-app-4c475.firebaseapp.com",
  projectId: "messaging-app-4c475",
  storageBucket: "messaging-app-4c475.appspot.com",
  messagingSenderId: "402861630323",
  appId: "1:402861630323:web:6dc57f7d2d8c14ab0c9b06"
}).auth();

// if (firebase.apps.length === 0) {
//   firebase.initializeApp({});
// }

// const auth = firebase.auth();
// const firestore = firebase.firestore();