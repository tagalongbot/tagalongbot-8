let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let viewProfile = async ({ query }, res) => {
  let { person_messenger_user_id } = query;

  let person = await getPersonByMessengerID(person_messenger_user_id);

  
}

module.exports = viewProfile;