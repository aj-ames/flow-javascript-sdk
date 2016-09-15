import * as jsverify from 'jsverify';
import * as uuid from 'node-uuid';
import {makeModel, BaseModel} from '../../src/db/BaseModel';
import {Cls} from '../../src/db/schema/Cls';
import {Deserialize} from 'cerialize';
import {DbApiClient} from '../../src/db/DbApiClient';
import {ApiInterface} from '../../src/db/api/ApiInterface';
import SinonMock = Sinon.SinonMock;
import SinonSandbox = Sinon.SinonSandbox;
import SinonStub = Sinon.SinonStub;
import {Field} from '../../src/db/schema/Field';
import {QueryResult} from '../../src/db/api/QueryResult';

describe('db.BaseModel.BaseModel', () => {
    let subject: typeof BaseModel;
    let testDbApi:ApiInterface = <ApiInterface>{};
    let testCls = new Cls();
    testCls.name = 'TestCls';
    testCls.fields = [
        <Field>{name: 'testfield1', type: 'string'},
        <Field>{name: 'testfield2', type: 'integer'},
        <Field>{name: 'testfield3', type: 'float'},
    ];
    testCls.indices = [];
    testCls.config = [];

    let generateTestObject = ((strSampler, intSampler, floatSampler): Function => {
        return (): {} => {return {_id: uuid.v1(), testfield1: strSampler(), testfield2: intSampler(), testfield3: floatSampler()}};
    })(
        jsverify.sampler(jsverify.string, 100000000),
        jsverify.sampler(jsverify.int32),
        jsverify.sampler(jsverify.number)
    );

    beforeEach(() => {
        subject = <typeof BaseModel> makeModel(testCls, testDbApi);
    });

    describe('constructor', () => {

    });

    describe('.get', () => {
        it('gives single object by id', () => {
            let testObj = generateTestObject();
            testDbApi.getObject = sinon.stub().resolves(testObj);
            return subject.get(testObj._id).should.be.fulfilled.then((obj) => {
                (<SinonStub> testDbApi.getObject).should.have.been.calledOnce.calledWith('testcls', testObj._id);
                obj.should.be.ok;
            });
        });

        it('fails if object doesn\'t exist', () => {
            testDbApi.getObject = sinon.stub().rejects(new Error('Object not found'));
            return subject.get('fakeid').should.be.rejectedWith(Error, 'Object not found');
        });

        it('converts object to the instance of the model', () => {
            let testObj = generateTestObject();
            testDbApi.getObject = sinon.stub().resolves(testObj);
            return subject.get(testObj._id).should.be.fulfilled.then((obj) => {
                obj.should.be.an.instanceof(subject);
                obj.testfield1.should.eql(testObj.testfield1);
                obj.testfield2.should.eql(testObj.testfield2);
                obj.testfield3.should.eql(testObj.testfield3);
            });
        });
    });

    describe('.all', () => {
        it('gives all the objects', () => {
            let testObjects = Array.apply(null, Array(100)).map(generateTestObject);
            testDbApi.allObjects = sinon.stub().resolves(testObjects);
            return subject.all().should.be.fulfilled.then((objs) => {
                (<SinonStub> testDbApi.allObjects).should.have.been.calledOnce.calledWith('testcls');
                objs.should.be.lengthOf(100);
            });
        });

        it('converts all objects to the instance of the model', () => {
            let testObjects = Array.apply(null, Array(100)).map(generateTestObject);
            testDbApi.allObjects = sinon.stub().resolves(testObjects);
            return subject.all().should.be.fulfilled.then((objs) => {
                objs.forEach((obj: any, i: number) => {
                    obj.should.be.an.instanceof(subject);
                    obj.testfield1.should.eql(testObjects[i].testfield1);
                    obj.testfield2.should.eql(testObjects[i].testfield2);
                    obj.testfield3.should.eql(testObjects[i].testfield3);
                });
            });
        });

        it('gives empty array if no objects', () => {
            testDbApi.allObjects = sinon.stub().resolves([]);
            return subject.all().should.be.fulfilled.then((objs) => {
                objs.should.be.empty;
            });
        });

        it('limits the number of objects optionally', () => {
            testDbApi.allObjects = sinon.stub().resolves([]);
            return subject.all(10).should.be.fulfilled.then(() => {
                (<SinonStub> testDbApi.allObjects).should.have.been.calledOnce.calledWith('testcls', {limit: 10});
            });
        });
    });

    describe('.find', () => {
        it('gives matching objects', () => {
            let testResult = <QueryResult>{
                metadata: {page: 1, pages: 1, total: 100},
                objects: Array.apply(null, Array(100)).map(generateTestObject)
            };
            let testQuery = {testfield1: {$eq: 'test'}};
            testDbApi.getObjects = sinon.stub().resolves(testResult);
            return subject.find(testQuery).should.be.fulfilled.then((objs) => {
                (<SinonStub> testDbApi.getObjects).should.have.been.calledOnce.calledWith('testcls', testQuery);
                objs.should.be.lengthOf(100);
            });
        });

        it('converts all objects to the instance of the model', () => {
            let testResult = <QueryResult>{
                metadata: {page: 1, pages: 1, total: 100},
                objects: Array.apply(null, Array(100)).map(generateTestObject)
            };
            let testQuery = {testfield1: {$eq: 'test'}};
            testDbApi.getObjects = sinon.stub().resolves(testResult);
            return subject.find(testQuery).should.be.fulfilled.then((objs) => {
                objs.forEach((obj: any, i: number) => {
                    obj.should.be.an.instanceof(subject);
                    obj.testfield1.should.eql((<any>testResult.objects[i]).testfield1);
                    obj.testfield2.should.eql((<any>testResult.objects[i]).testfield2);
                    obj.testfield3.should.eql((<any>testResult.objects[i]).testfield3);
                });
            });
        });

        it('gives empty array if no objects', () => {
            let testResult = <QueryResult>{
                metadata: {page: 1, pages: 1, total: 0},
                objects: []
            };
            let testQuery = {testfield1: {$eq: 'test'}};
            testDbApi.getObjects = sinon.stub().resolves(testResult);
            return subject.find(testQuery).should.be.fulfilled.then((objs) => {
                objs.should.be.empty;
            });
        });

        it('allows to pass additional options', () => {
            let testResult = <QueryResult>{
                metadata: {page: 1, pages: 1, total: 0},
                objects: []
            };
            let testQuery = {testfield1: {$eq: 'test'}};
            testDbApi.getObjects = sinon.stub().resolves(testResult);
            return subject.find(testQuery, {limit: 100, skip: 10}).should.be.fulfilled.then((objs) => {
                (<SinonStub> testDbApi.getObjects).should.have.been.calledOnce.calledWith('testcls', testQuery, {limit: 100, skip: 10});
            });
        });
    });

    describe('.count', () => {
        it('gives number of objects', () => {
            testDbApi.countObjects = sinon.stub().resolves(123);
            return subject.count().should.eventually.equal(123).then(() => {
                (<SinonStub> testDbApi.countObjects).should.have.been.calledOnce.calledWith('testcls');
            });
        });

        it('allows to count with query', () => {
            testDbApi.countObjects = sinon.stub().resolves(124);
            let testQuery = {testfield1: {$eq: 'test'}};
            return subject.count(testQuery).should.eventually.equal(124).then(() => {
                (<SinonStub> testDbApi.countObjects).should.have.been.calledOnce.calledWith('testcls', testQuery);
            });
        });
    });

    describe('#save', () => {
        it('creates new object if just instantiated', () => {
            let testObj = generateTestObject();
            delete testObj['_id']; // remove id for new obj
            let newObj = new subject(testObj);
            let newId = uuid.v1();
            testDbApi.createObject = sinon.stub().resolves(newId);
            return newObj.save().should.be.fulfilled.then((obj) => {
                (<SinonStub> testDbApi.createObject).should.have.been.calledOnce.calledWith('testcls', testObj);
                obj._id.should.eql(newId);
            });
        });

        it('updates existing object', () => {
            let testObj = generateTestObject();
            let newObj = new subject(testObj);
            testDbApi.updateObject = sinon.stub().resolves(null);
            return newObj.save().should.be.fulfilled.then(() => {
                (<SinonStub> testDbApi.updateObject).should.have.been.calledOnce.calledWith('testcls', testObj['_id'], {
                    testfield1: testObj.testfield1,
                    testfield2: testObj.testfield2,
                    testfield3: testObj.testfield3,
                });
            });
        });

        it('object changes are taken', () => {
            let testObj = generateTestObject();
            let newObj = new subject(testObj);
            testDbApi.updateObject = sinon.stub().resolves(null);

            return newObj.save().should.be.fulfilled.then(() => {
                (<SinonStub> testDbApi.updateObject).should.have.been.calledOnce.calledWith('testcls', testObj['_id'], {
                    testfield1: testObj.testfield1,
                    testfield2: testObj.testfield2,
                    testfield3: testObj.testfield3,
                });

                newObj['testfield1'] = 'new value';
                newObj['testfield2'] = 321123;
                newObj['testfield3'] = 11123123.23;

                return newObj.save().should.be.fulfilled.then(() => {
                    (<SinonStub> testDbApi.updateObject).should.have.been.calledTwice.calledWith('testcls', testObj['_id'], {
                        testfield1: 'new value',
                        testfield2: 321123,
                        testfield3: 11123123.23,
                    });
                });
            });
        });

        it('fails if object with given id is missing', () => {
            let testObj = generateTestObject();
            let newObj = new subject(testObj);
            testDbApi.updateObject = sinon.stub().rejects(new Error('Object not found'));
            return newObj.save().should.be.rejectedWith(Error, 'Object not found');
        });
    });

    describe('#delete', () => {
        it('deletes existing object', () => {
            let testObj = generateTestObject();
            let newObj = new subject(testObj);
            testDbApi.deleteObject = sinon.stub().resolves(null);
            return newObj.delete().should.be.fulfilled.then(() => {
                (<SinonStub> testDbApi.deleteObject).should.have.been.calledOnce.calledWith('testcls', testObj._id);
            });
        });

        it('does\'t allow to delete object without id', () => {
            let testObj = generateTestObject();
            delete testObj['_id'];
            let newObj = new subject(testObj);
            return newObj.delete().should.be.rejectedWith(Error, 'Object must have an id');
        });

        it('fails if object with given id is missing', () => {
            let testObj = generateTestObject();
            let newObj = new subject(testObj);
            testDbApi.deleteObject = sinon.stub().rejects(new Error('Object not found'));
            return newObj.delete().should.be.rejectedWith(Error, 'Object not found');
        });
    });

    describe('.getType', () => {
        it('generates the type name from the name', () => {
            subject.getType().should.eql('testcls');
        });
    });

    describe('#convertValue', () => {
        let subjectInstance: BaseModel;

        beforeEach(() => {
            subjectInstance = new subject();
        });

        it('converts integer', () => {
            jsverify.assert(jsverify.forall('int32', function (a) {
                return subjectInstance['convertValue'](a, 'integer') == a;
            }))
        });

        it('converts string', () => {
            jsverify.assert(jsverify.forall('asciistring', function (a) {
                return subjectInstance['convertValue'](a, 'string') == a;
            }))
        });

        it('converts float', () => {
            jsverify.assert(jsverify.forall('number', function (a) {
                return subjectInstance['convertValue'](a, 'float') == parseFloat(a);
            }))
        });

        it('converts boolean', () => {
            jsverify.assert(jsverify.forall('bool', function (a) {
                return subjectInstance['convertValue'](a, 'boolean') == a;
            }))
        });

        it('converts string array', () => {
            jsverify.assert(jsverify.forall('array asciistring', function (a: string[]) {
                return (<string[]>subjectInstance['convertValue'](a, 'array[string]')).toString() == a.toString();
            }))
        });
    });
});

describe('db.BaseModel.makeModel', () => {
    let testCls = <Cls>Deserialize({name: 'FirstObj', fields: [
        {name: 'teststring', type: 'string'},
        {name: 'testint', type: 'integer'},
        {name: 'testfloat', type: 'float'},
        {name: 'testbool', type: 'boolean'},
        {name: 'testarr', type: 'array[string]'},
    ], indices: [
        {name: 'idx_teststring_testint', fields: ['teststring', 'testint']},
        {name: 'idx_testint', fields: ['testint']},
    ], config: {
        sync: {
            strategy: 'PULL_AND_PUSH',
            config: {},
        }
    }}, Cls);

    let testDbClient = new DbApiClient();
    let testModel: any = makeModel(testCls, testDbClient.api);

    it('model is a BaseModel', () => {
        new testModel().should.be.an.instanceof(BaseModel);
    });

    it('model inherits static methods from BaseModel', () => {
        testModel.get.should.be.an.instanceof(Function);
    });

    it('model inherits static properties from BaseModel', () => {
        testModel.should.have.property('_name', 'FirstObj');
    });

    it('model inherits instance methods from BaseModel', () => {
        new testModel().save.should.be.an.instanceof(Function);
    });

    it('model has static reference to the api', () => {
        testModel.should.have.property('_api', testDbClient.api);
    });

    describe('model fields', () => {
        it('model has all the fields', () => {
            testModel.getFields().should.eql(['teststring', 'testint', 'testfloat', 'testbool', 'testarr']);
        });

        it('fields have data', () => {
            let testData = {
                teststring: 'test1',
                testint: 12345,
                testfloat: 12.345,
                testbool: true,
                testarr: ['test1', 'test2', 'test3'],
            };
            let instance = new testModel(testData);
            testCls.fields.forEach((field) => {
                instance.should.have.property(field.name);
                instance[field.name].should.eql(testData[field.name]);
            });
        });
    });
});