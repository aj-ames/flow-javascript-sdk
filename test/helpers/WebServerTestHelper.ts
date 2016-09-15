import * as http from 'http';

export class WebServerTestHelper {
    public static PORT = 9999;
    private static server: http.Server;
    private static requests: any[] = [];

    static start() {
        if (this.server != null) {
            this.stop();
        }
        this.server = http.createServer((req, res) => {
            this.requests.push([req.method, req.url]);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello, world!\n');
        });
        this.server.listen(this.PORT);
    }

    static stop(cb?: () => void) {
        this.server.close(() => {
            this.server = null;
            if (cb) {
                cb();
            }
        });
    }

    static shouldReceiveRequest(method: string, path: string) {
        let req;
        if (this.requests.length > 0) {
            req = this.requests[this.requests.length - 1];
        }
        if (req == null || req[0] != method || req[1] != path) {
            throw new Error(`Expected to receive ${method} request on ${path}`);
        }
    }
}
