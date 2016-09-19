// tslint:disable-next-line:export-name
export function urlEncode(obj: {}): string {
    const str = [];
    Object.keys(obj).forEach((p) => {
        if (obj.hasOwnProperty(p)) {
            str.push(typeof obj[p] === 'object' ? urlEncode(obj[p]) : encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    });
    return str.join('&');
}
