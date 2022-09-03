import React from 'react';
import styles from '../styles/error.scss';
import Utils from "../services/Utils";


export default function ConfirmationPage(props) {
    function confirmationClicked(code) {
        window.localStorage.setItem('code', code);
        window.close();
    }

    return (
        <div className={styles.container}>
            <div className={styles.error} onClick={() => confirmationClicked(props.code)}>
                Confirm account creation
            </div>
        </div>
    )
}