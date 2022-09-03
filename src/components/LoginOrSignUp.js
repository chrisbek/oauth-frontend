import React, {useState} from 'react';
import styles from '../styles/login.scss';
import Utils from "../services/Utils";
import NewWindow from 'react-new-window'
import OauthPopup from "react-oauth-popup";


export default function LoginOrSignUp(props) {
    const [authWindowMounted, setAuthWindowMounted] = useState(false);
    const [popupWindowCloseEventCount, setPopupWindowCloseEventCount] = useState(0);

    function loginPopupClosed(sessionId) {
        if (window.localStorage.getItem('code') === null) {
            // This is necessary due to a bug in react-oauth-popup
            return;
        }

        let code = window.localStorage.getItem('code');
        window.localStorage.removeItem('code');
        let args = new URLSearchParams({
            code: code,
            state: sessionId,
            redirected_from_popup: false.toString()
        });
        console.log('yooooo');
        window.location = Utils.getRedirectForLoginEndpoint() + "?" + args;
    }

    function signupPopupClosed(sessionId) {
        if (window.localStorage.getItem('code') === null) {
            // This is necessary due to a bug in react-oauth-popup
            return;
        }

        let code = window.localStorage.getItem('code');
        window.localStorage.removeItem('code');
        let args = new URLSearchParams({
            code: code,
            state: sessionId,
            redirected_from_popup: false.toString()
        });
        window.location = Utils.getRedirectForSignupEndpoint() + "?" + args;
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <div className={styles.login + " " + styles.flexContainer}>
                    <OauthPopup
                        url={getAuthorizationServerUrl(props.sessionId, Utils.getRedirectForLoginEndpoint())}
                        width={650}
                        height={650}
                        onClose={() => loginPopupClosed(props.sessionId)}
                    >
                        <div>Login with Local Authorization Server</div>
                    </OauthPopup>
                </div>

                <div className={styles.signup + " " + styles.flexContainer}>
                    <OauthPopup
                        url={getAuthorizationServerUrl(props.sessionId, Utils.getRedirectForSignupEndpoint())}
                        width={650}
                        height={650}
                        onClose={() => signupPopupClosed(props.sessionId)}
                    >
                        <div>Sign up with Local Authorization Server</div>
                    </OauthPopup>
                </div>
            </div>
        </div>
    );

    function renderError() {
        if (props.error === undefined) {
            return undefined;
        }

        return <div className={styles.error}>{props.error}</div>
    }

    function getAuthorizationServerUrl(sessionId, redirect_uri) {
        let authUrl = Utils.getAuthorizationEndpoint();
        let args = new URLSearchParams({
            response_type: "code",
            client_id: Utils.clientId,
            redirect_uri: redirect_uri,
            scope: "email profile",
            state: sessionId,
        });
        return authUrl + "?" + args
    }

    function loginClicked() {
        setAuthWindowMounted(true);
        // let authUrl = Utils.getAuthorizationEndpoint();
        //
        // let args = new URLSearchParams({
        //     response_type: "code",
        //     client_id: "314BS5M0GYM5YCM5SU2X4BF3",
        //     redirect_uri: Utils.getRedirectForLoginEndpoint(),
        //     scope: "email profile",
        //     state: Utils.getCookieValue("state")
        // });
        // <NewWindow url={authUrl + "?" + args} features={{width: 650, height: 650}} center={'screen'}/>
        // window.location = ;

        //
    }

    function signupClicked() {
        let authUrl = Utils.getAuthorizationEndpoint();

        let args = new URLSearchParams({
            response_type: "code",
            client_id: "908377655374-6db800subga997acil7n2e97jf3uqm7g.apps.googleusercontent.com",
            redirect_uri: Utils.getRedirectForSignupEndpoint(),
            scope: "email profile",
            state: Utils.getCookieValue("state")
        });
        window.location = authUrl + "?" + args;
    }
}