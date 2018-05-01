let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);

let searchProviders = async (data, { search_type, service_name, active = false }) => {
	let { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code } = data;

	let filterByFormula = '';
	if (search_type.toLowerCase() === 'state') {
		filterByFormula = `{Practice State} = '${search_providers_state.trim().toLowerCase()}'`;
	} else if (search_type.toLowerCase() === 'city') {
		filterByFormula = `{Practice City} = '${search_providers_city.trim().toLowerCase()}'`;
	} else if (search_type.toLowerCase() === 'zip_code') {
		filterByFormula = `{Practice Zip Code} = '${search_providers_zip_code.trim().toLowerCase()}'`;
	} else if (search_type.toLowerCase() === 'code') {
		filterByFormula = `{Practice Code} = '${search_provider_code.trim().toLowerCase()}'`;
	}

  // Concatenating Search Formula
  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let providers = await getPractices({ filterByFormula });

  if (service_name) {
    let providersByService = providers.filter((provider) => {
      return provider.fields['Practice Services'].map(service => service.toLowerCase()).includes(service_name);
    });

    return providersByService;
  }

	return providers;
}

let getProviderByUserID = async (messenger_user_id) => {
  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getPractices({ filterByFormula });
  return user;
}

let createButtons = (is_provider_active, is_provider_claimed, data) => {
  if (is_provider_active) {
    let view_services_btn_url = createURL(`${BASEURL}/provider/services`, data);
    let view_promos_btn_url = createURL(`${BASEURL}/provider/promos`, data);

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
  }

  if (!is_provider_claimed) {
    let claim_practice_url = createURL(`${BASEURL}/provider/claim/email`, data);

    let btn = {
      title: 'Claim Practice',
      type: 'json_plugin_url',
      url: claim_practice_url
    }

    return [btn];
  }

  if (is_provider_claimed && !is_provider_active) {
    let { messenger_user_id } = data;
    let already_claimed_url = createURL(`${BASEURL}/provider/claimed`, { messenger_user_id });

    let btn = {
      title: 'Already Claimed',
      type: 'json_plugin_url',
      url: already_claimed_url
    }
    
    return [btn];
  }
}

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let provider_name = encodeURIComponent(provider['Practice Name']);
  let provider_base_id = provider['Practice Base ID'];
  let data = { provider_id, provider_base_id, provider_name, first_name, last_name, gender, messenger_user_id };

  let buttons = createButtons(provider['Active?'], provider['Claimed?'], data);

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let sortProviders = (provider1, provider2) => {
  if (provider1.fields['Active?'] && !provider2.fields['Active?']) return -1;
  if (provider1.fields['Active?'] && provider2.fields['Active?']) return 0;
  if (!provider1.fields['Active?']) return 1;
}

module.exports = {
  searchProviders,
  getProviderByUserID,
  toGalleryElement,
  sortProviders,
}