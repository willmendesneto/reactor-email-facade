/* eslint-disable */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

require('dotenv-safe').config({ allowEmptyValues: true });

global.assert = chai.assert;
global.sinon = sinon;
global.expect = chai.expect;
