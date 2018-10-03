let { getPersonByMessengerID } = require('../../libs/data/people.js');

let hasCreatedProfile = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let redirect_to_blocks = ['[ROUTER] Search Partner'];
  res.send({ redirect_to_blocks });
}

module.exports = hasCreatedProfile;