let { getUserByMessengerID, updateUser, createUser } = require('../libs/users');

let createNewUser = async ({ user_email }) => {
  let update_data = {
    ['Email Address']: user_email,
  }
  
  let new_user = await createUser(update_data);

  return new_user;
}

let updateExistingUser = async ({ user_email, first_name, last_name, gender, messenger_user_id, user }) => {
  let update_data = {
    ['Email Address']: user_email,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['messenger user id']: messenger_user_id,
  }
  
  let updated_user = await updateUser(update_data, user);
  
  return updated_user;
}

let listProvider = async({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, user_email } = query;

  let user = await getUserByMessengerID(messenger_user_id);

  if (user) {
    let new_user = createNewUser({ user_email });
    return;
  }

  let updated_user = updateExistingUser({ user_email, first_name, last_name, gender, messenger_user_id, user });

  let redirect_to_blocks = ['List New Practice'];
  res.send({ redirect_to_blocks });
}

module.exports = listProvider;