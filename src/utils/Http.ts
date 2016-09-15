export function urlencode(obj: {}): string {
    let str = [];
    for(var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(typeof obj[p] == 'object' ? urlencode(obj[p]) : encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }
    return str.join('&');
}
