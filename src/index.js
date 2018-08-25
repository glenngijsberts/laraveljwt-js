// Import axios for http requests
import axios from 'axios';

function getHeaders(token) {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

function getToken(prefix) {
    const auth = JSON.parse(localStorage.getItem(`${prefix}-auth`) || '{}');
    if (auth.access_token) {
        return auth.access_token;
    }
    return false;
}

function checkAuthenticated() {
    return getToken() ? 1 : 0;
}

function log(string) {
    console.log(string);
}

class Auth {
    // Construct properties
    constructor(prefix, loginLocation, redirectAfterClearStorage, rederictAfterAuthenticated) {
        // Headers for http requests
        this.headers = getHeaders(getToken(this.prefix));
        // Prefix for naming the localstorage object
        this.prefix = prefix;
        // Location of login endpoint
        this.loginLocation = loginLocation;
        // Path to redirect after you logout (or get logged out)
        this.redirectAfterClearStorage = redirectAfterClearStorage;
        // Path to redirect after logging in
        this.rederictAfterAuthenticated = rederictAfterAuthenticated;

        // eslint-disable-next-line
        axios.interceptors.response.use(undefined, error => {
            // eslint-disable-next-line
            return new Promise((resolve, reject) => {
                // If the status of a response is 401 (unauthorized and is not coming from login)
                if (error.response.status === 401 && !error.response.request.responseURL.endsWith(this.loginLocation)) {
                    // Run method that clears tokens
                    this.logout();
                }
                throw error;
            });
        });
    }
    // Expecting type of user (either username or emailadress), username/email and password
    login(type, user, password) {
        return new Promise((resolve, reject) => {
            const credentials = {
                [type]: user,
                password,
            };
    
            const tokens = {};

            axios({
                method: 'POST',
                url: this.loginLocation,
                data: credentials,
                headers: this.headers,
            })
                .then(response => {
                    tokens.access_token = response.data.access_token;
                    tokens.expires_in = response.data.expires_in;
                    tokens.token_type = response.data.token_type;
                    resolve(tokens);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    setTokens(tokens) {
        if (tokens.access_token && tokens.expires_in && tokens.token_type) {
            // Save the object in localStorage
            localStorage.setItem(`${this.prefix}-auth`, JSON.stringify(tokens));
            window.location.href = this.rederictAfterAuthenticated;
            // else redirect to login because you're not logged in (duh)
        } else {
            window.location.href = this.redirectAfterClearStorage;
        }
    }

    logout() {
        // clears localstorage (tokens)
        localStorage.clear(`${this.prefix}-auth`);
        // Redirect to login
        window.location.href = this.redirectAfterClearStorage;
    }

    getCollection(url) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                headers: this.headers,
            })
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
}
export { getHeaders, getToken, checkAuthenticated, log };
export default Auth;