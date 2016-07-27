import React, {Component, PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import {Link} from 'react-router';
import classNames from 'classnames';
import FaCloudUpload from 'react-icons/lib/fa/cloud-upload';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FaEllipsisV from 'react-icons/lib/fa/ellipsis-v';

import FileList from '../../components/file-list/file-list.container';
import FileListSimple from '../../components/file-list-simple/file-list-simple.container';
import loggerFactory from '../../utils/logger';

import classes from './agent-email.scss';

const logger = loggerFactory('From agent-email.component');

export default class AgentEmail extends Component {
  static propTypes = {
    className: PropTypes.string,
    dataLoaded: PropTypes.bool,
    subject: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    hasFiles: PropTypes.bool.isRequired,

    loadData: PropTypes.func.isRequired,
    validateData: PropTypes.func.isRequired,
    onSubjectChange: PropTypes.func.isRequired,
    onBodyChange: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    send: PropTypes.func.isRequired
  }

  componentWillMount() {
    const {
      dataLoaded,
      loadData,
      validateData
    } = this.props;

    if (!dataLoaded) {
      logger.debug('Data not loaded');

      loadData().then(validateData);
    } else {
      logger.debug('Data loaded');

      validateData();
    }
  }

  onSubjectChange = event => {
    const {onSubjectChange} = this.props;

    onSubjectChange(event.target.value);
  }

  onBodyChange = event => {
    const {onBodyChange} = this.props;

    onBodyChange(event.target.value);
  }

  send = () => {
    logger.debug('Inside send');

    const {send} = this.props;

    send();
  }

  render() {
    const {
      className,
      subject,
      body,
      onDrop,
      hasFiles
    } = this.props;
    const rootClass = classNames(classes.root, className);

    let separator;
    let fileList;
    let fileListSimple;
    let bottomButton;

    if (hasFiles) {
      fileList = <FileList />;
      fileListSimple = <FileListSimple />;
      separator = <hr />;
      bottomButton = (
        <RaisedButton
          className={classes.bottomButton}
          label="Send email"
          primary
          fullWidth
          onClick={this.send}
        />);
    }

    return (
      <div
        className={rootClass}
      >
        <div>
          <h3 className={classes.title}>
            Timesheet and invoice
          </h3>
          <Link
            className={classes.menu}
            to={{
              pathname: '/config/agent-email'
            }}
          >
            <FaEllipsisV />
          </Link>
        </div>
        <div>
          <TextField
            multiLine
            rowsMax={2}
            fullWidth
            value={subject}
            floatingLabelText="Email subject"
            autoFocus
            onChange={this.onSubjectChange}
          />
        </div>
        <div>
          <TextField
            multiLine
            rowsMax={10}
            fullWidth
            value={body}
            floatingLabelText="Email body"
            onChange={this.onBodyChange}
          />
        </div>
        {fileListSimple}
        {separator}
        <RaisedButton
          className={classes.bottomButton}
          label="Send email"
          primary
          fullWidth
          onClick={this.send}
        />
        <Dropzone
          className={classes.dropzone}
          onDrop={onDrop}
        >
          <div>
            <FaCloudUpload className={classes.dropzoneIcon} />
            <p>Drop some files here, or click to select files to attach to the email.</p>
          </div>
        </Dropzone>
        {fileList}
        {bottomButton}
      </div>
    );
  }
}
