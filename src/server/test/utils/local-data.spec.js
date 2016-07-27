const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe.only('localData module', function () {
  it('should merge data from local config file', function () {
    const localConfig = {
      USER: {
        FIRST_NAME: 'test'
      }
    };

    const localData = proxyquire('../../src/utils/local-data', {
      jsonfile: {
        readFileSync: () => localConfig
      },
      mkdirp: {
        sync: Function.prototype
      },
      fs: {
        accessSync: Function.prototype
      }
    });

    expect(localData.USER.FIRST_NAME).to.not.eql(localConfig.USER.FIRST_NAME);

    localData.init();

    expect(localData.USER.FIRST_NAME).to.eql(localConfig.USER.FIRST_NAME);
  });

  it('should be able to save data locally', function () {
    const writeFileStub = sinon.spy();
    const localData = proxyquire('../../src/utils/local-data', {
      jsonfile: {
        writeFile: writeFileStub
      },
      mkdirp: {
        sync: Function.prototype
      },
      fs: {
        accessSync: () => {
          throw new Error();
        }
      }
    });

    localData.init();
    expect(localData.USER.FIRST_NAME).to.not.eql('test');

    localData.USER.FIRST_NAME = 'test';
    localData.save();

    expect(writeFileStub.called);
    expect(writeFileStub.args[0][1]['USER']).to.exist;
  });

  it('should allow to listed to events', function () {
    const writeFileStub = sinon.spy();
    const localData = require('../../src/utils/local-data');

    expect(localData.on).to.exist;
  });

  it('should emit an event when data is saved', function (done) {
    const localData = proxyquire('../../src/utils/local-data', {
      jsonfile: {
        writeFile: () => Promise.resolve()
      },
      mkdirp: {
        sync: Function.prototype
      },
      fs: {
        accessSync: () => {
          throw new Error();
        }
      }
    });

    localData.on('saved', done);

    localData.save();
  });

  it('should emit an event when saving data fails', function (done) {
    const localData = proxyquire('../../src/utils/local-data', {
      jsonfile: {
        writeFile: () => Promise.reject()
      },
      mkdirp: {
        sync: Function.prototype
      },
      fs: {
        accessSync: () => {
          throw new Error();
        }
      }
    });

    localData.on('save:failed', done);

    localData.save();
  });
});
