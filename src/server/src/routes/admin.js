const localData = require('../utils/local-data');

const clearToken = (req, res) => {
  delete localData.token;

  localData.save()
    .then(() => {
      res.locals.success('Token cleared.');
      return res.end();
    });
};

module.exports = {
  clearToken
};
