import request from 'axios';
import storeFactory from '../../../../src/client/app/store/storeFactory';
import * as agentEmailActions from '../../../../src/client/app/store/actions/agent-email.actions';
import * as utils from '../../../../src/client/app/utils';
import * as formData from '../../../../src/client/app/factories/form-data';
import _ from 'lodash';

describe('Agent email - ACTIONS', function () {
  var state;
  var dispatch;
  var currentState;

  beforeEach(function () {
    var store = storeFactory();
    state = store.getState();
    dispatch = store.dispatch;
  });

  describe('Send email', function () {
    beforeEach(function () {
      sinon.stub(request, 'post').returns(Promise.resolve());

      currentState = {
        agentEmail: {
          details: {
            emailSubject: 'someSubject',
            emailBody: 'someBody'
          },
          config: {
            receipients: 'name@example.org'
          },
          files: [{
            id: 1,
            data: {
              type: 'This should be a FormData object'
            },
            name: 'someName'
          }]
        }
      };

      state = Object.assign(state, currentState);
    });

    afterEach(function () {
      request.post.restore();
    });

    it('should make a post with a FormData object', function () {
      dispatch(agentEmailActions.send());

      expect(request.post.args[0][1].toString()).to.equal('[object FormData]');
    });

    it('should make a post with correct body parameters', function () {
      var agentEmail = currentState.agentEmail;
      var form = {
        append: sinon.spy(),
        data: _.noop
      };

      sinon.stub(formData, 'create').returns(form);

      dispatch(agentEmailActions.send());

      expect(form.append.calledWith('to', agentEmail.config.receipients)).to.be.true;
      expect(form.append.calledWith('subject', agentEmail.details.emailSubject)).to.be.true;
      expect(form.append.calledWith('content', agentEmail.details.emailBody)).to.be.true;
      expect(form.append.calledWith('files', agentEmail.files[0].data)).to.be.true;
    });

    it('should redirect to google authorisation page if 401 is received', function (done) {
      var failedRequest = {
        status: 401,
        data: {
          url: 'someUrl'
        }
      };

      request.post.restore();

      sinon.stub(utils, 'redirect');
      sinon.stub(request, 'post')
        .returns(Promise.reject(failedRequest));

      dispatch(agentEmailActions.send())
        .then(function () {
          expect(utils.redirect.calledWith('someUrl')).to.be.true;
          done();

          utils.redirect.restore();
        });
    });
  });

  describe('Parse the email data', function () {
    beforeEach(function () {
      currentState = {
        appConfig: {
          firstName: 'FirstName',
          lastName: 'LastName',
          companyName: 'CompanyName'
        },
        agentEmail: {
          config: {
            subjectTemplate: 'Subject ${ name } ${ company } ${ period }',
            bodyTemplate: 'Body ${ period }'
          }
        }
      };

      state = Object.assign(state, currentState);
    });

    it('should update the email subject and body', function () {
      sinon.stub(utils, 'getLastSunday').returns('2/2/2016');

      dispatch(agentEmailActions.parseEmailData())
        .then(function () {
          var expectedSubject = 'Subject FirstName LastName CompanyName 2/2/2016';
          var expectedBody = 'Body 2/2/2016';
          expect(state.agentEmail.details.emailSubject === expectedSubject).to.be.true;
          expect(state.agentEmail.details.emailBody === expectedBody).to.be.true;
          done();

          utils.getLastSunday.restore();
        });
    });
  });
});
