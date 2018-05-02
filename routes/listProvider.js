// 1. Ask for email
// 2. Update User Data
// 3. Check if user already listed practice
// 4. Send Confirmation Block Message

let { getProviderByUserID, updateUser } = require('../libs/users');

let listProvider = async({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  let { user_email } = query;

  let provider = await getProviderByUserID(messenger_user_id);

  if (provider) {
    let updateData = { 
      ['Claimed By Messenger User ID']: messenger_user_id,
      ['Claimed By Email']: user_email,
    }

    let updatedProvider = await updateProvider(updateData, provider);
  } else {
    
  }
  
  
  
  let block_name = (provider) ? '' : '';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

module.exports = listProvider;