import React from 'react';
import LoginOrSignUp from './LoginOrSignUp';
import styles from '../styles/app.scss';
import axios from "axios";
import Utils from "../services/Utils";
import Logout from "./Logout";
import Loading from "./Loading";
import Session from '../models/Session'
import ErrorPage from "./Error";
import ConfirmationPage from "./ConfirmationPage";


async function get_access_token_using_state_and_refresh_token_cookie(session_identifier) {
    let url = Utils.getExchangeRefreshForAccessTokenEndpoint();
    let data = {
        state: session_identifier,
    }
    return await axios.put(url, data);
}

async function refresh_access_token() {
    let url = Utils.getExchangeRefreshTokenEndpoint();
    return await axios.put(url);
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            session: Session.getSessionCookie(undefined)
        }
    }

    render() {
        return (
            <div className={styles.containerAll}>
                {this.render_conditional()}
            </div>
        );
    }

    render_conditional() {
        console.log(this.state.session);

        if (this.state.session.state === Session.CODE_AFTER_REDIRECT_POPUP) {
            window.localStorage.setItem('code', this.state.session.code);
            window.close();
        }

        if (this.state.session.state === Session.CODE_AFTER_REDIRECT_DURING_SIGNUP_POPUP) {
            return <ConfirmationPage code={this.state.session.code}/>
        }

        if (this.state.session.state === Session.ACCESS_TOKEN_AVAILABLE) {
            return <Logout onLogout={this.logout}/>
        }

        if (this.state.session.state === Session.ACCESS_TOKEN_MISSING_REFRESH_TOKEN_SESSION_ID_AVAILABLE) {
            // PUT backend-url/exchange_refresh_for_access
            // save access_token to state.access_token

            let response = get_access_token_using_state_and_refresh_token_cookie(this.state.session.session_identifier);
            response.then((response) => {
                // console.log(response);
                if (response.data.access_token) {
                    this.setState(() => {
                        return {
                            session: Session.getSessionCookie(response.data.access_token)
                        }
                    });
                } else {
                    // fresh /stateful with no cookies
                    console.error('failed to get access token');
                    window.location = Utils.getRedirectWithSessionIdEndpoint();
                }
            }).catch((error) => {
                // fresh /stateful with no cookies
                console.error(error);
                console.error('failed to get access token');
                window.location = Utils.getRedirectWithSessionIdEndpoint();
            });
            return <Loading/>
        }

        if (this.state.session.state === Session.ACCESS_TOKEN_SESSION_ID_MISSING_REFRESH_TOKEN_AVAILABLE) {
            // get access token with a POST backend-url/refresh_token - simple refresh case
            // save access_token to state.access_token
            let response = refresh_access_token();
            response.then((response) => {
                if (response.data.access_token) {
                    this.setState(() => {
                        return {
                            session: Session.getSessionCookie(response.data.access_token)
                        }
                    });
                } else {
                    // fresh /with-state with no cookies
                    console.error('failed to refresh');
                    window.location = Utils.getRedirectWithSessionIdEndpoint();
                }
            }).catch((error) => {
                // fresh /with-state with no cookies
                console.error(error);
                console.error('failed to refresh');
                window.location = Utils.getRedirectWithSessionIdEndpoint();
            });
            return <Loading/>
        }

        if (this.state.session.state === Session.ACCESS_TOKEN_REFRESH_TOKEN_SESSION_ID_MISSING) {
            window.location = Utils.getRedirectWithSessionIdEndpoint();
        }

        if (this.state.session.hasErrors()) {
            return <ErrorPage error={this.state.session.error_description}/>
        }

        if (this.state.session.state === Session.ACCESS_TOKEN_REFRESH_TOKEN_MISSING_SESSION_ID_AVAILABLE) {
            return <LoginOrSignUp error={undefined} sessionId={this.state.session.session_identifier}/>
        }

        return <Loading/>
    }

    logout() {
        // this.setState(() => {
        //     let session = new Session(undefined);
        //     session.state = Session.ACCESS_TOKEN_REFRESH_TOKEN_SESSION_ID_MISSING;
        //     return {
        //         session: session
        //     }
        // })
        let response = Utils.redirectToLogout();
        response
            .then(()=>{})
            .catch((error) => {
            console.error('failed to logout');
            console.error(error);
            window.location = Utils.getRedirectWithSessionIdEndpoint();
        });
    }
}
