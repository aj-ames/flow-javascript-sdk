Scandit Flow JavaScript SDK
-----------------------------
The Scandit Flow JavaScript SDK is a library that helps building applications integrated with the Scandit Flow platform.

Take a look at our related projects:
- module for AngularJS 1.x [Scandit Flow JavaScript SDK - AngularJS module](https://github.com/Scandit/flow-ng)

## Getting started
In order to start using the SDK you must have a Scandit Flow account.  
At the moment the only way to sign up is using the mobile app ([Scandit Flow - Android](https://play.google.com/store/apps/details?id=com.scandit.scandium), [Scandit Flow - iOS](https://itunes.apple.com/us/app/scandit-flow/id1021540580?mt=8)).

Once you have your account, log in to the web dashboard and configure access under [API Access](https://scandium.scandit.com/customer/api_access).

### Installing
Using npm _(for NodeJS)_:
```bash
$ npm install scandit-flow-sdk
```

Using bower:
```bash
$ bower install scandit-flow-sdk
```

Manually _(downloaded from [Releases](https://github.com/Scandit/flow-javascript-sdk/releases))_:
```html
<script src="scandit.min.js"></script>
```
### Usage
#### Client initialization
##### Static key access:
```js
var client = new Scandit.Client({
    method: Scandit.Auth.Method.STATIC_KEY,
    key: '-- YOUR STATIC API KEY --'
});

client.init()
    .then(function(authenticationStatus) {
        if (authenticationStatus) {
            console.log('Static key is valid');
            // you can use the client
        } else {
            console.log('Invalid static token');
        }
    })
    .catch(function(err) {
        console.log('Unexpected error during initialization: ' + err);
    });
```

##### User login (only works in a web browser) ([OAuth Implicit](https://tools.ietf.org/html/rfc6749#section-1.3.2)):
```js
var client = new Scandit.Client({
    method: Scandit.Auth.Method.USER_IMPLICIT,
    clientId: '-- YOUR CLIENT ID --',
    redirectUri: '-- YOUR REDIRECT URI --',
    popup: true
});

client.init()
    .then(function(authenticationStatus) {
        if (authenticationStatus) {
            console.log('You are authenticated');
            // you can use the client
        } else {
            console.log('User must login');
            // Use code below to authenticate user, e.g. after user clicks the login button
            // client.authenticate()
            //     .then((function () {
            //         console.log('Authenticated successfully');
            //     }))
            //     .catch(function (err) {
            //         console.log('Authentication failed: ' + err);
            //     });
        }
    })
    .catch(function(err) {
        console.log('Unexpected error during initialization: ' + err);
    });
```

#####  Client credentials ([OAuth Client Credentials](https://tools.ietf.org/html/rfc6749#section-1.3.4))
```js
var client = new Scandit.Client({
    method: Scandit.Auth.Method.CLIENT,
    clientId: '-- YOUR CLIENT ID --',
    clientSecret: '-- YOUR CLIENT SECRET --'
});

client.init()
    .then(function(authenticationStatus) {
        if (authenticationStatus) {
            console.log('Client is authenticated');
            // you can use the client
        } else {
            console.log('Login needed');
            // Use code below to authenticate client, e.g. can be triggered automatically or with a button click etc.
            // client.authenticate()
            //     .then((function () {
            //         console.log('Authenticated successfully');
            //     }))
            //     .catch(function (err) {
            //         console.log('Authentication failed: ' + err);
            //     });
        }
    })
    .catch(function(err) {
        console.log('Unexpected error during initialization: ' + err);
    });
```

#### Client usage
At the moment the only client functionality is accessing the Scandit Flow Cloud DB.  
In order to start using it you have to configure your database. Go to the _Database_ section on the web dashboard and define some classes.

Retrieving a list of configured models:
```js
client.Db.getAvailableModels()
```

Fetching all objects from the model (where `ModelName` is the class name you specified on the web dashboard):
```js
client.Db.ModelName.all()
    .then(function(objects) {
        console.log(objects);
    })
    .catch(function(error) {
        console.log('Cannot fetch objects: ' + error);
    });
```

#### Usage examples
For more detailed examples please take a look at the `examples` folder.

## Documentation
API documentation will be available soon. For general documentation please refer to [Scandit Flow - Documentation](https://scandium.scandit.com/customer/documentation). _(You need to log in with an already existing account to access the documentation)_


## License
The source code published here is released under the Apache 2.0 license: http://www.apache.org/licenses/LICENSE-2.0.

_Questions? Contact `support@scandit.com`._
