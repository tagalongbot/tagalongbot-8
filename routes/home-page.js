let riot = require('riot');

let view_template = require('../views/home-page.marko');

let sendHomePage = async ({ query }, res) => {
  res.marko(
    view_template,
  );
}

module.exports = sendHomePage;