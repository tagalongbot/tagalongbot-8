let view_template = require('../../../views/welcome-screen.marko');

let viewWelcomePage = async ({ query }, res) => {
  res.marko(
    view_template,
  );
}

module.exports = viewWelcomePage;