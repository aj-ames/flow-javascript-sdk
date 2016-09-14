import {WebServerTestHelper} from '../helpers/WebServerTestHelper';
import {HttpClient} from "../../src/http/HttpClient";
import {Response} from "../../src/http/HttpClientInterface";

describe('http.HttpClient', () => {
    let subject: HttpClient;

    beforeEach(() => {
        subject = new HttpClient();
        WebServerTestHelper.start();
    });

    afterEach((done: () => void) => {
        WebServerTestHelper.stop(done);
    });

    describe('#request', () => {
        it('performs HTTP request', (done) => {
            subject.request("GET", `http://localhost:${WebServerTestHelper.PORT}/test/`)
                .then((response: Response) => {
                    WebServerTestHelper.shouldReceiveRequest('GET', '/test/');
                    response.status.should.eq(200);
                    done();
                })
                .catch((error: string) => {
                    done(error);
                })
        });
    });

    describe('#get', () => {
        it('performs GET HTTP request', (done) => {
            subject.get(`http://localhost:${WebServerTestHelper.PORT}/test2/`)
                .then((response: Response) => {
                    WebServerTestHelper.shouldReceiveRequest('GET', '/test2/');
                    response.status.should.eq(200);
                    done();
                })
                .catch((error: string) => {
                    done(error);
                })
        });
    });

    describe('#post', () => {
    });

    describe('#put', () => {
    });

});
