let { BASEURL } = process.env;

let view_template = require('../../views/welcome-screen.marko');

let sendWelcomeScreen = async ({ query }, res) => {
  let { user_id, BASEURL } = query;

  res.marko(
    view_template,
    { user_id, BASEURL }
  );
}

module.exports = sendWelcomeScreen;