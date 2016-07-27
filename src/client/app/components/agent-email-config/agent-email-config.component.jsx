import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FaCheck from 'react-icons/lib/fa/check';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';

import {STATUS} from '../../config/constant';
import classes from './agent-email-config.scss';

const statusIcon = {
  [STATUS.SUCCESS]: <FaCheck className={classes.status} />,
  [STATUS.FAILED]: <FaExclamationCircle className={classes.status} />
};

export class AgentEmailConfig extends Component {
  static propTypes = {
    status: PropTypes.string,
    title: PropTypes.string.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    from: PropTypes.string,
    receipients: PropTypes.string,
    subjectTemplate: PropTypes.string,
    bodyTemplate: PropTypes.string,

    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired
  }

  state = {
    from: this.props.from,
    receipients: this.props.receipients,
    subjectTemplate: this.props.subjectTemplate,
    bodyTemplate: this.props.bodyTemplate
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
      from,
      receipients,
      subjectTemplate,
      bodyTemplate
    } = this.state;

    saveData({
      from,
      receipients,
      subjectTemplate,
      bodyTemplate
    });
  }

  handleFromChange = event => {
    this.setState({from: event.target.value});
  }

  handleReceipientsChange = event => {
    this.setState({receipients: event.target.value});
  }

  handleSubjectTemplateChange = event => {
    this.setState({subjectTemplate: event.target.value});
  }

  handleBodyTemplateChange = event => {
    this.setState({bodyTemplate: event.target.value});
  }

  render() {
    const {
      status,
      title
    } = this.props;

    const {
      from,
      receipients,
      subjectTemplate,
      bodyTemplate
    } = this.state;

    return (
      <div>
        <h1>{title}</h1>
        <ul className={classes.list}>
          <li className={classes.element}>
            <TextField
              fullWidth
              floatingLabelText="Your email"
              defaultValue={from}
              onChange={this.handleFromChange}
            />
          </li>
          <li className={classes.element}>
            <TextField
              fullWidth
              floatingLabelText="Receipients email"
              multiLine
              defaultValue={receipients}
              onChange={this.handleReceipientsChange}
            />
          </li>
          <li className={classes.element}>
            <TextField
              fullWidth
              floatingLabelText="Email subject template"
              multiLine
              defaultValue={subjectTemplate}
              onChange={this.handleSubjectTemplateChange}
            />
          </li>
          <li className={classes.element}>
            <TextField
              fullWidth
              floatingLabelText="Email body template"
              multiLine
              defaultValue={bodyTemplate}
              onChange={this.handleBodyTemplateChange}
            />
          </li>
          <li className={classes.element}>
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

export default AgentEmailConfig;
