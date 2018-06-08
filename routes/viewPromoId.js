let viewPromoId = async ({ query }, res) => {
  let { messenger_user_id, promo_id } = query;
  
  let view_claimed_promos = createURL(`${BASEURL}/promo/view/claimed`, {  });
  
  let msg = createButtonMessage(
    `User ID: ${messenger_user_id} \n\n Promo ID: ${promo_id}`,
    `View Claimed Promos|json_plugin_url|${view_claimed_promos}`
  );
}

module.exports = viewPromoId;