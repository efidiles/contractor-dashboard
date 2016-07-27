import React, {PropTypes} from 'react';
import classNames from 'classnames';

import File from '../file/file.component';
import classes from './file-list.scss';
import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From file-list.container');

const FileList = props => {
  logger.trace('props', props);

  const {files, className, ...others} = props;
  const rootClass = classNames(classes.root, className);

  return (
    <ul className={rootClass}>
      {
        files.map(
          (file, index) => (
            <li
              className={!index ? classes.firstItem : classes.item}
              key={index}
            >
              <File file={file} {...others} />
            </li>
          ))
        }
    </ul>
  );
};

FileList.propTypes = {
  className: PropTypes.string,
  files: PropTypes.array.isRequired,
  fileTypes: PropTypes.array.isRequired,

  remove: PropTypes.func.isRequired,
  changeFileType: PropTypes.func.isRequired
};

export default FileList;
