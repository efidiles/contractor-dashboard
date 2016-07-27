import moment from 'moment';
import _ from 'lodash';

export const getLastSunday = () =>
  moment()
    .subtract(1, 'weeks')
    .endOf('isoWeek')
    .format('DD/MM/YYYY');

export const getFileName = (provider, type) => {
  const fileName = [provider, type, 'period ending', getLastSunday()]
    .join('-')
    .toLowerCase();

  return _.kebabCase(fileName);
};

export const redirect = url => {
  window.location.href = url;
};
