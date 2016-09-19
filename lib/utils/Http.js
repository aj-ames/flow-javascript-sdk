"use strict";
// tslint:disable-next-line:export-name
function urlEncode(obj) {
    var str = [];
    Object.keys(obj).forEach(function (p) {
        if (obj.hasOwnProperty(p)) {
            str.push(typeof obj[p] === 'object' ? urlEncode(obj[p]) : encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    });
    return str.join('&');
}
exports.urlEncode = urlEncode;
//# sourceMappingURL=Http.js.map