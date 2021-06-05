import React from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import './css/Login.css'
import firebase from 'firebase/app';

import { auth } from '../firebase'

export default function Login() {
    return (
        <div id="login-page">
            <div id="login-card">
                <h1>
                    Welcome to Chat!
                </h1>
                <div
                    className="login-button google"
                    onClick={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}
                >
                    <GoogleOutlined />
                    <span>Sign in usign Google</span>
                </div>

            </div>
            
        </div>
    )
}
