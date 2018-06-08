let { createButtonMessage } = require('../libs/bots');

let viewPromoId = async ({ query }, res) => {
  let { messenger_user_id, promo_id } = query;

  let msg = createButtonMessage(
    `User ID: ${messenger_user_id} \n\nPromo ID: ${promo_id}`,
    `View Claimed Promos|show_block|[User] View Claimed Promotions`,
    `Main Menu|show_block|Discover Main Menu`
  );

  let messages = [msg];

  res.send({ messages });
}

module.exports = viewPromoId;