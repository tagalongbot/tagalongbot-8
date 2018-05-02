let { getUserByMessengerID, updateUser, createUser } = require('../libs/users');

let listProvider = async({ query }, res) => {
  let first_name = query['first name'];
  let last_name = query['last name'];
  let gender = query['gender'];
  let messenger_user_id = query['messenger user id'];
  let { user_email } = query;

  let user = await getUserByMessengerID(messenger_user_id);

  if (user) {
    let updateData = { 
      ['Email Address']: user_email,
    }

    let updatedUser = await updateUser(updateData, user);
  } else {
    let newUserData = {
      ['First Name']: first_name,
      ['Last Name']: last_name,
      ['Gender']: gender,
      ['messenger user id']: messenger_user_id,
      ['Email Address']: user_email,
    }
    
    let newUser = await createUser(newUserData);
  }

  let redirect_to_blocks = ['List New Practice'];
  res.send({ redirect_to_blocks });
}

module.exports = listProvider;