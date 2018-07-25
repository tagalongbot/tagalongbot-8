let { getPracticePromo } = require('../../../../libs/data/practice/promos.js');
let { getUserByMessengerID } = require('../../../../libs/data/users.js');

let { updatePromo, createUpdateMsg } = require('../../../../libs/admin/promos/user/update.js');

let updateUserPromo = async ({ query }, res) => {
  // Code Needs to be refactored, since the update will happen from a password protected webview
  let { practice_promos_base_id, promo_id, user_messenger_id } = query;
  // console.log('user_messenger_id', user_messenger_id); // Added twice to url

  let promo = await getPracticePromo(
    { practice_promos_base_id, promo_id }
  );

  let user = await getUserByMessengerID(user_messenger_id);

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

  let updatedPromo = await updatePromo({ practice_promos_base_id, promo, user_record_id });

  let msg = createUpdateMsg();
  let messages = [msg];
  res.send({ messages });
}

module.exports = updateUserPromo;