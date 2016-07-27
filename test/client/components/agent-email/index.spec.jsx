import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import { shallow, mount } from 'enzyme';
import {Link} from 'react-router';
import Dropzone from 'react-dropzone';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AgentEmail from '../../../../src/client/app/components/agent-email';
import FileList from '../../../../src/client/app/containers/agent-email/file-list.container';
import FileListSimple from
  '../../../../src/client/app/components/file-list-simple.container';

describe('Agent email - COMPONENT', () => {
  let wrapper;

  describe('Data not loaded', function() {
    let attrs;

    beforeEach(() => {
      attrs = {
        dataLoaded: false,
        subject: '',
        body: '',
        hasFiles: false,
        onSubjectChange: sinon.spy(),
        loadData: sinon.spy(),
        onBodyChange: sinon.spy(),
        onDrop: sinon.spy(),
        send: sinon.spy()
      };
    });

    it('should call the loadData handler if data is not loaded', function() {
      const wrapper = shallow(<AgentEmail {...attrs} />);
      expect(attrs.loadData.called).to.be.true;
    });

    it('should not call the loadData handler if data is loaded', function() {
      attrs.dataLoaded = true;
      const wrapper = shallow(<AgentEmail {...attrs} />);
      expect(attrs.loadData.called).to.be.false;
    });
  });

  describe('Data loaded', function() {
    let wrapper;
    let attrs;

    beforeEach(() => {
      attrs = {
        dataLoaded: true,
        subject: 'Some subject',
        body: 'Some body',
        hasFiles: false,
        onSubjectChange: sinon.spy(),
        loadData: sinon.spy(),
        onBodyChange: sinon.spy(),
        onDrop: sinon.spy(),
        send: sinon.spy()
      };

      wrapper = shallow(<AgentEmail {...attrs} />);
    });

    it('should display the subject in the subject textbox', function() {
      expect(wrapper.find({floatingLabelText: 'Email subject'})
        .props()
        .value
      ).to.equal(attrs.subject);
    });

    it('should display the body in the body textbox', function() {
      expect(wrapper.find({floatingLabelText: 'Email body'})
        .props()
        .value
      ).to.equal(attrs.body);
    });

    it('should call the onSubjectChange cb with the new value when the user updates the subject',
        function() {
          var subjectElement = wrapper.find({floatingLabelText: 'Email subject'});
          var newValue = 'New subject';

          subjectElement.simulate('change', {
            target: {
              value: newValue
            }
          });

          expect(attrs.onSubjectChange.calledWith(newValue)).to.be.true;
      }
    );

    it('should call the onBodyChange cb with the new value when the user updates the body',
      function() {
        var bodyElement = wrapper.find({floatingLabelText: 'Email body'});
        var newValue = 'New body';

        bodyElement.simulate('change', {
          target: {
            value: newValue
          }
        });

        expect(attrs.onBodyChange.calledWith(newValue)).to.be.true;
      }
    );

    it('should call the onDrop callback when the user adds a file', function() {
      var dropzoneElement = wrapper.find(Dropzone);
      var file = {name: 'Some file'};

      dropzoneElement.simulate('drop', file);

      expect(attrs.onDrop.calledWith(file)).to.be.true;
    });

    it('should have a button to open the config modal', function() {
      expect(wrapper.find(Link).length).to.equal(1);
    });

    it('should call the send handler when clicking the send button', function() {
      wrapper.find(RaisedButton).simulate('touchTap');
      expect(attrs.send.called).to.be.true;
    });
  });

  describe('With files', function() {
    let attrs;

    beforeEach(() => {
      attrs = {
        dataLoaded: false,
        subject: '',
        body: '',
        hasFiles: true,
        onSubjectChange: sinon.spy(),
        loadData: sinon.spy(),
        onBodyChange: sinon.spy(),
        onDrop: sinon.spy(),
        send: sinon.spy()
      };

      wrapper = shallow(<AgentEmail {...attrs} />);
    });

    it('should display a summary of the files when the user has added files', function() {
      expect(wrapper.find(FileListSimple).length).to.equal(1);
    });

    it('should display a preview of the files when the user has added files', function() {
      expect(wrapper.find(FileList).length).to.equal(1);
    });
  });

  describe('Fully rendered', function() {
    let attrs;

    beforeEach(() => {
      attrs = {
        dataLoaded: true,
        subject: 'Some subject',
        body: 'Some body',
        hasFiles: false,
        onSubjectChange: sinon.spy(),
        loadData: sinon.spy(),
        onBodyChange: sinon.spy(),
        onDrop: sinon.spy(),
        send: sinon.spy()
      };

      render(<AgentEmail className="test" {...attrs} />, window.CONFIG.COMPONENT_WRAPPER);
    });

    afterEach(function() {
      unmountComponentAtNode(window.CONFIG.COMPONENT_WRAPPER);
    });

    it('should set the focus on the subject on init', function() {
      expect(document.activeElement.value).to.equal(attrs.subject);
    });
  });
});
