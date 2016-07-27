import React, {PropTypes, Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import classNames from 'classnames';
import injectTapEventPlugin from 'react-tap-event-plugin';

import classes from './file.scss';

injectTapEventPlugin();

export default class File extends Component {
  static propTypes = {
    className: PropTypes.string,
    file: PropTypes.object.isRequired,
    fileTypes: PropTypes.array.isRequired,

    remove: PropTypes.func.isRequired,
    changeFileType: PropTypes.func.isRequired
  }

  changeFileType = (event, index, value) => {
    const {changeFileType, file} = this.props;

    changeFileType(file.id, value);
  }

  remove = () => {
    const {file} = this.props;

    this.props.remove(file.id);
  }

  render() {
    const {className, file, fileTypes} = this.props;
    const rootClass = classNames(classes.root, className);

    return (
      <div className={rootClass}>
        <p><strong>Filename:</strong> {file.name}</p>
        <img
          className={classes.image}
          alt="Preview of ${file.name}"
          src={file.data.preview}
        />
        <div>
          <SelectField
            value={file.type}
            fullWidth
            onChange={this.changeFileType}
            className={classes.selectField}
          >
            {
              fileTypes.map((type, index) => (
                <MenuItem
                  key={index}
                  value={type}
                  primaryText={type}
                />
              ))
            }
          </SelectField>
          <div className={classes.removeWrapper}>
            <RaisedButton
              label="Remove"
              secondary
              onClick={this.remove}
            />
          </div>
        </div>
      </div>
    );
  }
}
