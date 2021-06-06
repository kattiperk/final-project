import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './App.css';
import './components/css/Chat.css';
import Login  from "./components/Login";
import Chats from "./components/Chats";
import { AuthProvider } from "./contexts/AuthContext"

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// firebase.initializeApp({
//   apiKey: "AIzaSyDLPTDnPCnD4iEty4SdULz0IRLwr72PNTQ",
//   authDomain: "messaging-app-4c475.firebaseapp.com",
//   projectId: "messaging-app-4c475",
//   storageBucket: "messaging-app-4c475.appspot.com",
//   messagingSenderId: "402861630323",
//   appId: "1:402861630323:web:6dc57f7d2d8c14ab0c9b06"
// })

// if (firebase.apps.length === 0) {
//   firebase.initializeApp({});
// }

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  // const [user] = useAuthState(auth);

  return (
    <div className="bg-light pt-5 pb-5">
      {/* <div className="container d-flex w-25 bg-dark rounded-3"> */}
      {/* <div className="row"> */}
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/chats" component={Chats} />
            {/* <Route path="/chats" component={Chat} /> */}
            <Route path="/" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
      {/* </div> */}
      {/* </div> */}
    {/* <div className="container d-flex w-25 bg-dark rounded-3">
      <div className="row">
      <header className="fixed-top">
          <SignOut />
      </header>
      <section className="w-100 p-3">
        <article>
          {user ? <Chat /> : <SignIn />}
        </article>
      </section>
      </div>
    </div> */}
    </div>
  );
}

// function SignIn() {

//   const signInWithGoogle = () => {
//     const signInMethod = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(signInMethod);
//   }

//   return (
//     <>
//       <button onClick={signInWithGoogle}>Sign in using Google</button>
//     </>
//   )

// }

// function SignOut() {
//   return auth.currentUser && (
//     <button onClick={() => auth.signOut()}>Sign Out</button>
//   )
// }


function Chat() {
  const autoScroll = useRef();
  const messagesDB = firestore.collection('messages');
  const query = messagesDB.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesDB.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    autoScroll.current.scrollIntoView({ behavior: 'smooth' }); // sets auto scroll to bottom when new message sent
  }

  return (<>
    <main>

      {messages && messages.map(msg => <Message key={msg.id} message={msg} />)}

      <span ref={autoScroll}></span>

    </main>

    <form onSubmit={sendMessage}>
      <div className="input-group mb-3">
        <input value={formValue} className="form-control" onChange={(e) => setFormValue(e.target.value)} aria-label="Type message here" aria-describedby="button-send" />
        <button id="button-send" className="btn btn-outline-secondary" type="submit" disabled={!formValue}>Send</button>
      </div>
    </form>
  </>)
}


function Message(props) {
  const { text, uid, photoURL } = props.message;

  const messageStatus = uid === auth.currentUser.uid ? 'sent' : 'read';

  return (<>
    <div className={`message message-${messageStatus} d-flex justify-content-end align-items-center mb-4`}>
      
      <div className="message-text-wrapper me-3 p-2 rounded-2 bg-secondary bg-gradient">
        <p className="message-text m-0">{text}</p>
      </div>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} className="message-avatar rounded-circle" />
    </div>
  </>)
}


export default App;
