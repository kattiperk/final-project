import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../firebase';
import './css/Chats.css';

import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Chats() {
    const didMountRef = useRef(false);
    const history = useHistory();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await auth.signOut();
        history.push('/');
    }

    const getFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();

        return new File([data], 'userPhoto.jpg', { type: 'image/jpeg' })
    }

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true

            if(!user || user === null) {
                history.push('/');
                return;
            }

            axios.get(
                'https://api.chatengine.io/users/me/',
                { headers: {
                    "project-id": process.env.REACT_APP_MESSENGER_CHAT_ID,
                    "user-name": user.email,
                    "user-secret": user.uid,
                }
            })

            .then(() => {
                setLoading(false);
            })

            .catch(() => {
                let formdata = new FormData();
                formdata.append('email', user.email);
                formdata.append('username', user.email);
                formdata.append('secret', user.uid);

                getFile(user.photoURL)
                    .then((avatar) => {
                        formdata.append('avatar', avatar, avatar.name)

                        axios.post('https://api.chatengine.io/users/',
                            formdata,
                            { headers: {
                                "private-key": process.env.REACT_APP_MESSENGER_CHAT_KEY,
                            }}
                        )
                        .then(() => setLoading(false))
                        .catch((error) => console.log(error))
                    })
            })
        }
    }, [user, history]);

    if(!user || loading) return 'Loading...';

    return (
        <div className="chats-page">
            <div className="nav bg-dark ps-5 pe-5 d-flex justify-content-between align-items-center">
                <div className="logo">
                    Messenger Chat
                </div>
                <button type="button" onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div> 

            <ChatEngine
                height="calc(100vh - 66px)"
                projectID={process.env.REACT_APP_MESSENGER_CHAT_ID}
                userName={user.email}
                userSecret={user.uid}
            />
        </div>
    )
}
