import React from 'react';
import styles from '../styles/logout.scss';
import Utils from "../services/Utils";
import axios from "axios";


export default class Logout extends React.Component {

    constructor(props) {
        super(props);
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.loginForm}>
                    <div className={styles.welcome}>Welcome {Utils.getUserNameFromCookie()}</div>
                    <div className={styles.logout + " " + styles.flexContainer} onDoubleClick={this.buttonClicked}>
                        Logout
                    </div>
                </div>
            </div>
        );
    }


    buttonClicked() {
        let logoutUrl = Utils.getLogoutEndpoint();

        axios.put(logoutUrl, {}).then((response) => {
            this.props.onLogout();
        }).catch((error) => {
            console.log(error);
        });
    }

}