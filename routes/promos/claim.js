let express = require('express');
let router = express.Router();

let askForUserEmail = async ({ query }, res) => {
  let { promo_id, provider_id } = query;

  let redirect_to_blocks = ['Ask For Email (Promo)'];
  let set_attributes = { promo_id, provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let claimPromotion = async ({ query }, res) => {
  let { promo_id, provider_id, gender, user_email } = query;
  let messenger_user_id = query['messenger user id'];
  let first_name = query['first name'];
  let last_name = query['last name'];

  let provider = await findPractice(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];
  let provider_phone_number = provider.fields['Practice Phone #'];
  let provider_booking_url = provider.fields['Practice Booking URL'];

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  if (!promo || promo.fields['Claim Limit Reached'] === "1") {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }

  let userData = { provider_base_id, messenger_user_id, first_name, last_name, gender, user_email };
  let userData = { messenger_user_id, first_name, last_name, gender, user_email, provider_base_id };
  let user = await createOrUpdateUser(userData, provider);

  let claimed_by_users = promo.fields['Claimed By Users'] || [];
  if (claimed_by_users.includes(user.id)) {
    let redirect_to_blocks = ['Promo Already Claimed By User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let claimed_users = [
    ...new Set([user.id, ...claimed_by_users])
  ];

  let updatePromoData = {
    'Total Claim Count': Number(promo.fields['Total Claim Count']) + 1,
    'Claimed By Users': claimed_users,
  }

  let updatedPromo = await updatePromo(updatePromoData, promo);

  let view_provider_url = createURL(`${BASEURL}/promo/provider`, { ...query, ...userData });

  let txtMsg = createButtonMessage(
    `Congrats ${first_name} your promotion "${updatedPromo.fields['Promotion Name']}" has been claimed!`,
    `Call Provider|phone_number|${provider_phone_number}`,
    `View Booking Site|web_url|${provider_booking_url}`,
    `View Provider|json_plugin_url|${view_provider_url}`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

router.get('/email', askForUserEmail);
router.get('/', claimPromotion);

module.exports = router;