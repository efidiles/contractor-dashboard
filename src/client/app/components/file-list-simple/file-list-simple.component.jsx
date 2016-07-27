import React, {PropTypes} from 'react';

import classes from './file-list-simple.scss';

const FileListSimple = props => (
  <div>
    <h5>Attachments:</h5>
    <ul className={classes.listSimple}>
      {props.files.map(
        (file, index) => (
          <li
            className={classes.item}
            key={index}
          >
            {file.name}
          </li>
        ))
      }
    </ul>
  </div>
);

FileListSimple.propTypes = {
  files: PropTypes.array.isRequired
};

export default FileListSimple;
