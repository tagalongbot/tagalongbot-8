// 1. Ask for email
// 2. Update User Data
// 3. Check if user already listed practice
// 4. Send Confirmation Block Message

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

  let block_name = (provider) ? '' : '';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

module.exports = listProvider;