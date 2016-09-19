import {TestHttpClient} from '../helpers/TestHttpClient';
import {IResponse} from '../../src/http/HttpClientInterface';
import {DbApiClient} from '../../src/db/DbApiClient';

describe('db.DbApiClient', () => {
    let subject;

    before(() => {
        subject = new DbApiClient();
    });

    describe('#init', () => {
        let testHttpClient;
        let testDbSchema;

        before(() => {
            testHttpClient = new TestHttpClient();
            testDbSchema = {
                classes: [
                    {name: 'FirstObj', fields: [
                        {name: 'teststring', type: 'string'},
                        {name: 'testint', type: 'integer'},
                        {name: 'testfloat', type: 'float'},
                        {name: 'testbool', type: 'boolean'},
                        {name: 'testarr', type: 'array[string]'}
                    ], indices: [
                        {name: 'idx_teststring_testint', fields: ['teststring', 'testint']},
                        {name: 'idx_testint', fields: ['testint']}
                    ], config: {
                        sync: {
                            strategy: 'PULL_AND_PUSH',
                            config: {}
                        }
                    }},
                    {name: 'SecondObj', fields: [
                        {name: 'teststring', type: 'string'},
                        {name: 'testint', type: 'integer'}
                    ], indices: [], config: {
                        sync: {
                            strategy: 'PULL_AND_PUSH',
                            config: {}
                        }
                    }},
                    {name: 'ThirdObj', fields: [
                        {name: 'teststring', type: 'string'}
                    ], indices: [], config: {
                        sync: {
                            strategy: 'PULL_AND_PUSH',
                            config: {}
                        }
                    }}
                ]
            };
        });

        beforeEach(() => {
            const mockResponse = <IResponse>{};
            mockResponse.status = 200;
            mockResponse.body = JSON.stringify(testDbSchema);
            mockResponse.headers = {'Content-Type': 'application/json'};
            testHttpClient.mockResponse('GET', 'http://test/api/v1/storage/_schema', mockResponse);
        });

        describe('fetching DB structure', () => {
            it('generates models', () => {
                return subject.init(testHttpClient)
                    .then(() => {
                        expect(subject.FirstObj).to.be.a('function');
                        expect(subject.SecondObj).to.be.a('function');
                        expect(subject.ThirdObj).to.be.a('function');
                    });
            });

            it('fails if api request fails', () => {
                const mockResponse = <IResponse>{};
                mockResponse.status = 500;
                testHttpClient.mockResponse('GET', 'http://test/api/v1/storage/_schema', mockResponse);

                return subject.init(testHttpClient).should.be.rejected;
            });
        });
    });

});
