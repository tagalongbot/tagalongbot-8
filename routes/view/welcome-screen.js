let view_template = require('../../views/welcome-screen.marko');

let sendWelcomeScreen = async ({ query }, res) => {
  let { user_id } = query;

  res.marko(
    view_template,
    { user_id }
  );
}

module.exports = sendWelcomeScreen;