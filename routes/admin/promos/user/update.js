let { updatePromo, createUpdateMsg } = require('../../../../libs/admin/promos/user/update.js');
let { getPracticePromo } = require('../../../../libs/data/practice/promos.js');
let { getPracticeUser } = require('../../../../libs/data/practice/users.js');

let updateUserPromo = async ({ query }, res) => {
  let { provider_base_id, promo_id, user_messenger_id } = query;
  // console.log('user_messenger_id', user_messenger_id); // Added twice to url

  let promo = await getPracticePromo({ provider_base_id, promo_id });
  let user = await getPracticeUser({ provider_base_id, user_messenger_id });

  if (!user) {
    let redirect_to_blocks = ['[Admin Verify Promo] User Does Not Exist'];
    res.send({ redirect_to_blocks });
    return;
  }

  let user_record_id = user.id;
  let user_ids = promo.fields['Promo Used By Users'] || [];

  if (user_ids.includes(user_record_id)) {
    let user_name = `${user.fields['First Name']} ${user.fields['Last Name']}`;
    let set_attributes = { user_name };
    let redirect_to_blocks = ['User Already Used Promo'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let updatedPromo = await updatePromo({ provider_base_id, promo, user_record_id });

  let msg = createUpdateMsg();
  let messages = [msg];
  res.send({ messages });
}

module.exports = updateUserPromo;