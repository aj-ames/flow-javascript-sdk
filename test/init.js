// Utils
var chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
global.expect = chai.expect;
global.sinon = require('sinon');
global.sinonAsPromised = require('sinon-as-promised');

var MockBrowser = require('mock-browser').mocks.MockBrowser;
var browser = new MockBrowser();
global.document = browser.getDocument();
global.window = browser.getWindow();
global.location = browser.getLocation();
global.history = browser.getHistory();
