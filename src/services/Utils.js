import jwt from 'jwt-simple';
import axios from "axios";


class Utils {
    frontendServiceUrl = 'https://authentication.local/dev/auth';
    sessionStateCookieName = 'sd';
    frontendServicePublicKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC5x+mTZVnUHUA3DrT6G7jJZ5HL6JfZZKaXWWniiGmQEt1qJm6cg1lQxdJCWbYJU06A6mFwl37NJF2UhpGwmn9MYC9bb9/pMYcdnm9OU/V13dKhKoojAse14NqD/PLh8HPUJuVXBXua8nL3Tc54bhzCTU7f3CWR449Yt9LLHu7zMgO6aGXHzzMGeSIJw1fmR42jIh6P8o8lOaKLgASi4JGmp2VNXJkvEKjnGpnBO9IK6MnkMbrvENM7lQlUYIB0Qk3Ci1AX/0mA/w5xsfJFyWLRxGT8fWLc9iwKlONf4i+YhRIvswqzadfDY/okWUp7qvbQlAtWKTzytRzMcKbatdYR6kvzrgKtSOSC730B6mxHY3s4VEXszpntt4H0l0kC3REEo4d1IEKKYjFqn4P8whBXQWmGl1xRTxAw4UT22c0PF2JMucaK1mX6y0ul0HbgKqVeO6uS647x5E5MSXF2x2lLiCh/csoUchZnGYOQqa9qhqUPe2lH9Rpm8HYpqIpd1Wi0JoHF5RDC9LZYn1o4x2WLobQBzFJN9R80kCdcO9znGyUBLoG2KUCsN6X1agNpoFV77TvQq+c92Yq6cIHhc3GAOiqcUGYEZfwfAzYba6Jb5PhtScUbthCP8Gzcd7pmASjI2/WyKFxyRBFWnIlsWEbAE+rZ2xR0A4cieEwns5HkGw== christophoros@christophoros-Aspire-E5-575G\n';
    frontendServiceJwtAlgorithm = 'HS256';
    clientId = '7WXY9BL9LV1D7AS1TCTQN7QU';

    getAuthorizationEndpoint() {
        let authServer = "https://authorization-server.local";
        let endpoint = "/auth";

        return authServer + endpoint;
    }

    getLogoutEndpoint() {
        return this.frontendServiceUrl + "/logout";
    }

    getRedirectForLoginEndpoint() {
        return this.frontendServiceUrl + "/login_redirect"
    }

    getRedirectForSignupEndpoint() {
        return this.frontendServiceUrl + "/signup_redirect"
    }

    getExchangeRefreshForAccessTokenEndpoint() {
        return this.frontendServiceUrl + '/exchange_refresh_for_access';
    }

    getExchangeRefreshTokenEndpoint() {
        return this.frontendServiceUrl + '/refresh_token';
    }

    getRedirectWithSessionIdEndpoint() {
        return this.frontendServiceUrl + '/stateful';
    }

    getParameterFromUrlParameters(parameterName) {
        let query = location.search.substring(1);
        let params = query.split("&");
        let parameterValue = undefined;
        params.forEach((param, index) => {
            let key = param.split("=")[0];
            let value = param.split("=")[1];
            if (key === parameterName) parameterValue = value;
        });

        return parameterValue;
    }

    async redirectToLogout() {
        return await axios.put(this.getLogoutEndpoint());
    }

    removeQueryParametersFromUrl() {
        window.history.pushState({}, document.title, window.location.pathname);
    }

    getCookieValue(name) {
        return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || undefined;
    }

    removeCookie(name, path = "/") {
        document.cookie = name + '=; Path=' + path + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    getUserDataFromCookie() {
        let userDataJson = this.getCookieValue('user_info');
        if (userDataJson === undefined) {
            return undefined;
        }
        let encodedString = userDataJson.slice(1,-1);
        return this.getDictFromEncodedString(encodedString);
    }

    getUserNameFromCookie() {
        let userData = this.getUserDataFromCookie();
        try {
            return userData.name;
        } catch (e) {
            return "";
        }
    }

    getDictFromEncodedString(encodedString) {
        return JSON.parse(window.atob(encodedString));
    }

    getSessionDataFromCookie() {
        let cookie = this.getCookieValue(this.sessionStateCookieName);
        if (cookie === undefined) {
            return undefined;
        }

        return jwt.decode(
            cookie, this.frontendServicePublicKey, true, this.frontendServiceJwtAlgorithm
        );
    }
}


export default new Utils();