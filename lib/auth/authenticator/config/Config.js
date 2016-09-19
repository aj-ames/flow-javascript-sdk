"use strict";
exports.authDefaults = {
    AUTHENTICATION_HEADER: 'Authorization',
    BASE_URL: (function () {
        var baseUrl;
        if (process) {
            baseUrl = process.env.BASE_URL;
        }
        else if (window) {
            baseUrl = window.BASE_URL;
        }
        return baseUrl ? baseUrl : 'https://scandium.scandit.com';
    })(),
    AUTHORIZATION_PATH: '/api/v1/auth/oauth2/authorize',
    TOKEN_PATH: '/api/v1/auth/oauth2/token'
};
(function (AuthMethod) {
    AuthMethod[AuthMethod["CLIENT"] = 0] = "CLIENT";
    AuthMethod[AuthMethod["USER_IMPLICIT"] = 1] = "USER_IMPLICIT";
    AuthMethod[AuthMethod["USER_CREDENTIALS"] = 2] = "USER_CREDENTIALS";
    AuthMethod[AuthMethod["STATIC_KEY"] = 3] = "STATIC_KEY";
})(exports.AuthMethod || (exports.AuthMethod = {}));
var AuthMethod = exports.AuthMethod;
(function (StorageMethod) {
    StorageMethod[StorageMethod["COOKIE_STORAGE"] = 0] = "COOKIE_STORAGE";
    StorageMethod[StorageMethod["LOCAL_STORAGE"] = 1] = "LOCAL_STORAGE";
    StorageMethod[StorageMethod["SESSION_STORAGE"] = 2] = "SESSION_STORAGE";
    StorageMethod[StorageMethod["NO_STORAGE"] = 3] = "NO_STORAGE";
})(exports.StorageMethod || (exports.StorageMethod = {}));
var StorageMethod = exports.StorageMethod;
//# sourceMappingURL=Config.js.map