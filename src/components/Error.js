import React from 'react';
import styles from '../styles/error.scss';
import Utils from "../services/Utils";


export default function ErrorPage(props) {
    function redirectToMain() {
        window.location = Utils.getRedirectWithSessionIdEndpoint();
    }

    return  (
        <div className={styles.container}>
            <div className={styles.error} onClick={redirectToMain}>
                <span>{props.error}</span>
                <span>(you might need to sign up first)</span>
            </div>
        </div>
    )
}