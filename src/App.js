import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDLPTDnPCnD4iEty4SdULz0IRLwr72PNTQ",
  authDomain: "messaging-app-4c475.firebaseapp.com",
  projectId: "messaging-app-4c475",
  storageBucket: "messaging-app-4c475.appspot.com",
  messagingSenderId: "402861630323",
  appId: "1:402861630323:web:6dc57f7d2d8c14ab0c9b06"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Messaging App</h1>
        <SignOut />
      </header>

      <section>
        {user ? <Chat /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const signInMethod = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(signInMethod);
  }

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in using Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


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

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function Message(props) {
  const { text, uid, photoURL } = props.message;

  const messageStatus = uid === auth.currentUser.uid ? 'sent' : 'read';

  return (<>
    <div className={`message message-${messageStatus}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
