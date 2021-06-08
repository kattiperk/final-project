import React from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import './css/Login.css';
import firebase from 'firebase/app';

import { auth } from '../firebase'

export default function Login() {
    return (
        <div className="login-wrapper bg-dark bg-gradient d-flex align-items-center justify-content-center">
            <div className="login-card bg-white rounded-circle">
                <h1>
                    Welcome to Chat!
                </h1>
                <button
                    className="btn btn-primary google"
                    onClick={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}
                >
                    <GoogleOutlined />
                    <span className="ps-2">Sign in</span>
                </button>
            </div>
        </div>
    )
}
