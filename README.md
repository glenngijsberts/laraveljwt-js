# laraveljwt-js

Package _(ES6)_ that can handle the authentication for your client side app using `Promises` and `Localstorage`. This package was build for my own needs but I was using it all the time for my projects so I would like to open source it for other people who are using Laravel JWT as authentication. The package contains a `ES6 Class` and some Helper functions that can be easily imported in one of your `Vue`, `React` or any other, ES6, client side projects. It is using [axios](https://github.com/axios/axios) so that depedency is required to install.

## Install

```javascript
npm i laraveljwtjs axios // or 'yarn add laraveljwtjs axios'
```

## Usage

### Class setup

```javascript
// Import the Class
import Auth from 'laraveljwtjs';

// Create new Auth class
const Auth = new Auth(prefix, loginLocation, redirectAfterClear, redirectAfterAuthenticated);

// Example
const Auth = new Auth('api', '/api/v1/auth/login', 'login', '/');
```

**prefix**

The parameter `prefix` is for prefixing your auth object in `LocaleStorage`. It will be placed in your `localStorage` as `prefix-auth`.

**loginLocation**

`loginLocation` parameter will be used as the `url` for the `POST` request of the `login()` method. This parameter is also used to prevent an error when you're getting a `401` status with logging in to your API.

**redirectAfterClear**

Url parameter for redirecting you after you call the `logout()` method.

**redirectAfterClear**

Url parameter for redirecting you after you've been authenticated.

### Methods

This class has different methods to handle the authentication.

#### Login

This method will handle a `POST` request to your API. It expects the `type` of entity (e.g. 'email'), the value of the entity and password for the user you are trying to authenticate.

```javascript
// Using the setup from above
Auth.login(type, user, password)

// Example
Auth.login('username', 'admin', 'password123')
    .then(response => {
        // Handle response (save the token)
        console.log(response);
     })
    .catch(error => {
        // Prompt an error message
        console.log(error);
    });
```

**type**

Type will be most likely `username` or `email`. This depends on which `entity` you would like to `POST` to your API. Under the hood this will look like

```javascript
const credentials = {
    [type]: user,
    password,
};
```

**user**

Value of the parameter `type`. 

**password**

Password for the account you are trying to authenticate.

#### setTokens

This method will save your `tokens` (coming from your response) to your `localStorage` and redirect you to given location.

```javascript
Auth.setTokens(tokens); 

// Example
Auth.login('username', 'admin', 'password123')
    .then(response => {
        // This will be most likely 'response.data' (depens on your API settings)
        Auth.setTokens(response.data); 
     })
    .catch(error => {
        // Prompt an error message
        console.log(error);
    });
```

**tokens**

The `login()` method will return a `response` from your API. You can use this `response` (most likely `response.data` ) as your argument for the method.

#### Logout

This method will handle your logout. It will remove your `prefix-auth` object from `localStorage` and redirect you to given location (In your `new Auth()` class).

```javascript
Auth.logout();
```

#### getCollection

This method can handle simple `GET` requests. Use the parameter `url` to create a request, which will be using your `token` saved in your `localStorage`. This method returns a `promise`.

```javascript
Auth.getCollection(url);

// Example
Auth.getCollection('/api/v1/projects')
    .then(response => {
        // Do something with the data
       console.log(response);
     })
    .catch(error => {
        // Prompt an error message
        console.log(error);
    });
```

### Helpers

This package is using some Helper functions I created, listed below.

### checkAuthenticated

If you have need to check if you're authenticated, you can use this function. This will return either `true` or `false`, based on your `localStorage` object. Under the hood it will use the `getToken` helper that is listed below. It requires to give your `prefix` but can be used without the `Auth` class.

```javascript
import { checkAuthenticated } from 'laraveljwtjs';

// Check if you're authenticated
console.log(checkAuthenticated('api'));
```

### getHeaders & getToken

These two functions are used together in the `Auth` class to retrieve the headers that are required for making the http requests. The `getToken()` helper will return your `access_token` from `localStorage`. It requires your `prefix` but can be used without the `Auth` class. The `getHeaders()` helper will generate the required headers for your http requests and will be using the token you get from the `getToken()` helper.

```javascript
getHeaders(getToken(prefix));

//Example
const headers = getHeaders(getToken('api'));

axios.get('/api/v1/projects', {
    headers,
})
    .then((response) => {
        // Get the data
        console.log(response.data);
    })
    .catch(error => console.log(error));

// getHeaders under the hood
function getHeaders(token) {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
    };
}
```

```javascript
import { checkAuthenticated } from 'laraveljwtjs';

// Check if you're authenticated
console.log(checkAuthenticated('api'));
```

### Features under the hood

#### Checking for '401'

This class is using an `interceptor` from the `axios` package. This interceptor will run before each http request and will check for a status `401`. This means that you're `authenticated`. The package will handle this and will run the `logout()` method for you. This will remove the `tokens` from your `localStorage` and redirect you back to you're `login` location (given in the `Auth` class). 


## Features for the future

* Generic http requests
* Write tests
* Code compiling

## Contribution

Feel free to contribute to this package. If you have any questions you can reach out to me on [twitter](https://twitter.com/glenngijsberts) 😄

## License

MIT




