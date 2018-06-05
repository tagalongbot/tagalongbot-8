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

    
  return [btn1, btn2];