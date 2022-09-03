import Utils from "../services/Utils";
import UserInfo from "./UserInfo";

function sessionDataIncludeNotNullField(sessionData, fieldName) {
    return fieldName in sessionData && sessionData[fieldName] !== null;
}

class Session {
    static ACCESS_TOKEN_AVAILABLE = 'logged in';
    static ACCESS_TOKEN_SESSION_ID_MISSING_REFRESH_TOKEN_AVAILABLE = 'must refresh';
    static ACCESS_TOKEN_MISSING_REFRESH_TOKEN_SESSION_ID_AVAILABLE = 'must exchange refresh for access';
    static ACCESS_TOKEN_REFRESH_TOKEN_MISSING_SESSION_ID_AVAILABLE = 'render login/signup page';
    static ACCESS_TOKEN_REFRESH_TOKEN_SESSION_ID_MISSING = 'redirect to home in order to get session id';
    static SERVER_ERROR = 'server error';
    static AUTHORIZATION_EXCEPTION = 'redirect to home due to auth exception';
    static UNEXPECTED_EXCEPTION = 'redirect to home due to unexpected exception';
    static CODE_AFTER_REDIRECT_POPUP = 'save code to localStorage, close popup';
    static CODE_AFTER_REDIRECT_DURING_SIGNUP_POPUP = 'show confirmation page';
    static ErrorCodesForServerExceptions = [3000, 3001, 3002, 5000, 5001, 5003, 5004];
    static UnauthorizedServerExceptions = [4001, 4002, 4003, 4004];
    state;
    session_identifier = undefined;
    userInfo = undefined;
    accessToken = undefined;
    error_description = undefined;
    code = undefined;

    constructor(state, error_description = undefined) {
        this.state = state;
        this.error_description = error_description;
    }

    hasErrors() {
        return this.state === Session.SERVER_ERROR ||
            this.state === Session.AUTHORIZATION_EXCEPTION ||
            this.state === Session.UNEXPECTED_EXCEPTION;
    }

    static getSessionCookie(accessToken) {
        let sessionData = Utils.getSessionDataFromCookie();
        let session;

        if ((accessToken === null || accessToken === undefined) && (sessionData === null || sessionData === undefined)) {
            return new Session(Session.ACCESS_TOKEN_REFRESH_TOKEN_SESSION_ID_MISSING);
        }

        if (accessToken !== undefined) {
            session = new Session(Session.ACCESS_TOKEN_AVAILABLE);
            session.accessToken = accessToken;
            // session.userInfo = new UserInfo(sessionData['user_info']['username']);
            return session;
        }

        // Check for errors - section start
        if (sessionDataIncludeNotNullField(sessionData, 'error_code')) {
            if (sessionData['error_code'] in Session.ErrorCodesForServerExceptions) {
                if (sessionDataIncludeNotNullField(sessionData, 'error_desc')) {
                    return new Session(Session.SERVER_ERROR, sessionData['error_desc']);
                }
                return new Session(Session.SERVER_ERROR, 'server error');
            }

            if (sessionData['error_code'] in Session.UnauthorizedServerExceptions) {
                return new Session(Session.AUTHORIZATION_EXCEPTION);
            }

            // If you got here it is an unexpected exception
            if ('error_desc' in sessionData) {
                return new Session(Session.UNEXPECTED_EXCEPTION, sessionData['error_desc']);
            }
            return new Session(Session.UNEXPECTED_EXCEPTION, 'unexpected error');
        }
        // Check for errors - section end

        if (
            sessionDataIncludeNotNullField(sessionData, 'session_identifier') &&
            sessionDataIncludeNotNullField(sessionData, 'refresh_token_is_set') &&
            sessionData['refresh_token_is_set']
        ) {
            session = new Session(Session.ACCESS_TOKEN_MISSING_REFRESH_TOKEN_SESSION_ID_AVAILABLE);
            session.session_identifier = sessionData['session_identifier'];
            return session;
        }

        if (sessionDataIncludeNotNullField(sessionData, 'refresh_token_is_set') && sessionData['refresh_token_is_set']) {
            return new Session(Session.ACCESS_TOKEN_SESSION_ID_MISSING_REFRESH_TOKEN_AVAILABLE);
        }

        if (sessionDataIncludeNotNullField(sessionData, 'session_identifier')) {
            session = new Session(Session.ACCESS_TOKEN_REFRESH_TOKEN_MISSING_SESSION_ID_AVAILABLE);
            session.session_identifier = sessionData['session_identifier'];
            return session;
        }

        if (sessionDataIncludeNotNullField(sessionData, 'redirected_from_popup')) {
            // Following code will be executed by the popup window
            if (sessionDataIncludeNotNullField(sessionData, 'session_state') && sessionData['session_state'] === 'signup' ) {
                // Redirected during signup
                session = new Session(Session.CODE_AFTER_REDIRECT_DURING_SIGNUP_POPUP);
                session.code = sessionData['code'];
                return session;
            }

            // Redirected during login
            session = new Session(Session.CODE_AFTER_REDIRECT_POPUP);
            session.code = sessionData['code'];
            return session;
        }
    }
}

export default Session;