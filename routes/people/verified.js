let { getPersonByMessengerID } = require('../../libs/data/people.js');

let canUserVerify = async ({ query }, res) => {
  let { messenger_user_id } = query;
  console.log('query', query)

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person.fields['Verified?']) {
    let redirect_to_blocks = ['[Verify] User Not Verified'];
    res.send({ redirect_to_blocks });
    return;
  }

  let redirect_to_blocks = ['Verify User'];
  res.send({ redirect_to_blocks });
}

module.exports = canUserVerify;