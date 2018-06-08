let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');
let { createButtonMessage } = require('../libs/bots');

let viewPromoId = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender1, promo_id} = query;

  let view_claimed_promos = createURL(`${BASEURL}/promo/view/claimed`, { messenger_user_id, first_name, last_name, gender: gender1 });

  let msg = createButtonMessage(
    `User ID: ${messenger_user_id} \n\n Promo ID: ${promo_id}`,
    `View Claimed Promos|json_plugin_url|${view_claimed_promos}`,
    `Main Menu|show_block|Discover Main Menu`
  );

  let messages = [msg];

  res.send({ messages });
}

module.exports = viewPromoId;