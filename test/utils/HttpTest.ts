import {urlEncode} from '../../src/utils/Http';

describe('utils.Http', () => {
    
    describe('#limitpage', () => {
        const obj = { limit: 10, page: 1 };

        it('urlEncode', (done) => {
            expect(urlEncode(obj)).to.be.eq('limit=10&page=1');
            done();
        });
    });

    describe('#query', () => {
        const obj = { query: {"timestamp":{"$gt":1519084800000}}, limit: 10000 };

        it('urlEncode', (done) => {
            expect(urlEncode(obj)).to.be.eq('query=%7B%22timestamp%22%3A%7B%22%24gt%22%3A1519084800000%7D%7D&limit=10000');
            done();
        });
    });

});
