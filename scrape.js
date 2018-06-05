if (is_provider_active) {
  let view_services_btn_url = createURL(`${BASEURL}/provider/services`, data);
  let view_promos_btn_url = createURL(`${BASEURL}/provider/promos`, data);

  let btns = [];

  let btn1 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: view_services_btn_url,
  }

  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: view_promos_btn_url,
  }

  if (!is_provider_claimed) {
    let claim_practice_url = createURL(`${BASEURL}/provider/claim/email`, data);

    let btn = {
      title: 'Claim Practice',
      type: 'json_plugin_url',
      url: claim_practice_url
    }
  }

  if (is_provider_claimed && !is_provider_active) {
    let { messenger_user_id } = data;
    let already_claimed_url = createURL(`${BASEURL}/provider/claimed`, { messenger_user_id });

    let btn = {
      title: 'Already Claimed',
      type: 'json_plugin_url',
      url: already_claimed_url
    }
  }
}