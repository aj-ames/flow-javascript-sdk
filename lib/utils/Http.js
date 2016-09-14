"use strict";
function urlencode(obj) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(typeof obj[p] == "object" ? urlencode(obj[p]) : encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}
exports.urlencode = urlencode;
//# sourceMappingURL=Http.js.map