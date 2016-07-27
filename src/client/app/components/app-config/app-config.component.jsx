import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FaCheck from 'react-icons/lib/fa/check';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';

import {STATUS} from '../../config/constant';
import classes from './app-config.scss';

const statusIcon = {
  [STATUS.SUCCESS]: <FaCheck className={classes.status} />,
  [STATUS.FAILED]: <FaExclamationCircle className={classes.status} />
};

export default class AppConfig extends Component {
  static propTypes = {
    inModal: PropTypes.bool,
    dataLoaded: PropTypes.bool.isRequired,
    status: PropTypes.string,
    messages: PropTypes.object,
    title: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    clientId: PropTypes.string,
    clientSecret: PropTypes.string,
    redirectUrl: PropTypes.string,

    saveData: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired
  }

  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    companyName: this.props.companyName,
    clientId: this.props.clientId,
    clientSecret: this.props.clientSecret,
    redirectUrl: this.props.redirectUrl
  }

  componentWillMount() {
    const {
      dataLoaded,
      loadData
    } = this.props;

    if (!dataLoaded) {
      loadData();
    }
  }

  onSave = () => {
    const {saveData} = this.props;

    const {
      firstName,
      lastName,
      companyName,
      clientId,
      clientSecret,
      redirectUrl
    } = this.state;

    saveData({
      firstName,
      lastName,
      companyName,
      clientId,
      clientSecret,
      redirectUrl
    });
  }

  handleFirstNameChange = event => {
    this.setState({firstName: event.target.value});
  }

  handleLastNameChange = event => {
    this.setState({lastName: event.target.value});
  }

  handleCompanyNameChange = event => {
    this.setState({companyName: event.target.value});
  }

  handleClientIdChange = event => {
    this.setState({clientId: event.target.value});
  }

  handleClientSecretChange = event => {
    this.setState({clientSecret: event.target.value});
  }

  render() {
    const {
      status,
      title,
      redirectUrl
    } = this.props;

    const {
      firstName,
      lastName,
      companyName,
      clientId,
      clientSecret
    } = this.state;

    return (
      <div>
        <h1>{title}</h1>
        <ul className={classes.list}>
          <li className={classes.item}>
            <TextField
              fullWidth
              floatingLabelText="First name"
              defaultValue={firstName}
              onChange={this.handleFirstNameChange}
            />
          </li>
          <li className={classes.item}>
            <TextField
              fullWidth
              floatingLabelText="Last name"
              defaultValue={lastName}
              onChange={this.handleLastNameChange}
            />
          </li>
          <li className={classes.item}>
            <TextField
              fullWidth
              floatingLabelText="Company name"
              defaultValue={companyName}
              onChange={this.handleCompanyNameChange}
            />
          </li>
          <li className={classes.item}>
            <TextField
              fullWidth
              floatingLabelText="Client ID"
              defaultValue={clientId}
              onChange={this.handleClientIdChange}
            />
          </li>
          <li className={classes.item}>
            <TextField
              fullWidth
              floatingLabelText="Client secret"
              defaultValue={clientSecret}
              onChange={this.handleClientSecretChange}
            />
          </li>
          <li className={classes.item}>
            <TextField
              fullWidth
              floatingLabelText="Redirect URL (copy this to Google credentials page)"
              defaultValue={redirectUrl}
              disabled
            />
          </li>
          <li className={classes.item}>
            <RaisedButton
              label="Save"
              primary
              onClick={this.onSave}
            />
            {statusIcon[status]}
          </li>
        </ul>
      </div>
    );
  }
}
