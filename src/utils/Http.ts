// tslint:disable-next-line:export-name
export function urlEncode(obj: {}): string {
    const str = [];
    Object.keys(obj).forEach((p) => {
        if (obj.hasOwnProperty(p)) {
            if (typeof obj[p] === 'object') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(JSON.stringify(obj[p])));
            } else {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
    });
    return str.join('&');
}
