import * as Colors from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

export const THEME = {
  fontFamily: 'Bariol, sans-serif',
  palette: {
    primary1Color: Colors.cyan800,
    primary2Color: Colors.cyan800,
    primary3Color: Colors.teal50,
    accent1Color: Colors.cyan800,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: '#6e7b8d',
    alternateTextColor: Colors.teal50,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.cyan500
  }
};

export const COLORS = {
  GRAY: 'gray'
};

export default {
  THEME,
  COLORS
};
