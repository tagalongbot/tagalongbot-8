let { BASEURL, PRACTICE_DATABASE_BASE_ID, DEFAULT_PROVIDER_IMAGE, SEARCH_PROVIDERS_MORE_OPTIONS_IMAGE_URL } = process.env;
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, updateTableData } = require('../libs/data');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);
let updatePractice = updateTableData(practiceTable);

let searchProviders = async (data, { search_type, active = false }) => {
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

  // console.log('Searching Providers:', filterByFormula);

  // Concatenating Search Formula
  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let providers = await getPractices({ filterByFormula });

	return providers;
}

let getProviderByUserID = async (messenger_user_id, fields = []) => {
  let filterByFormula = `{Claimed By Messenger User ID} = '${messenger_user_id}'`;
  let [user] = await getPractices({ filterByFormula, fields });
  return user;
}

let updateProvider = async (updateData, provider) => {
  let updatedProvider = updatePractice(updateData, provider);
  return updatedProvider;
}

let filterProvidersByService = (service_name, providers) => {
  let service_name_lowercased = service_name.toLowerCase();
  let providersByService = providers.filter((provider) => {
    return provider.fields['Practice Services'].map(service => service.toLowerCase()).includes(service_name_lowercased);
  });

  return providersByService;
}

let sortProviders = (provider1, provider2) => {
  if (provider1.fields['Active?'] && !provider2.fields['Active?']) return -1;
  if (provider1.fields['Active?'] && provider2.fields['Active?']) return 0;
  if (!provider1.fields['Active?']) return 1;
}

let createButtons = (provider, data) => {
  let is_provider_active = provider['Active?'];
  let is_provider_claimed = provider['Claimed?'];
  // We're currently not showing unclaimed practices in the bot by passing `{ active: true }` to `searchProviders`

  let view_provider_site_url = provider['Practice Website'];
  let view_provider_book_url = provider['Practice Booking URL'];

  let btns = [];

  if (view_provider_site_url) {
    let btn = {
      title: 'Visit Provider Site',
      type: 'web_url',
      url: view_provider_site_url,
    }

    btns.push(btn);
  }

  if (view_provider_book_url) {
    let btn = {
      title: 'Visit Booking Site',
      type: 'web_url',
      url: view_provider_book_url,
    }

    btns.push(btn);
  }

  return btns;
}

let createButtons2 = (provider, data) => {
  let is_provider_active = provider['Active?'];
  let is_provider_claimed = provider['Claimed?'];
  // We're currently not showing unclaimed practices in the bot by passing `{ active: true }` to `searchProviders`

  let view_provider_site_url = provider['Practice Website'];
  let view_provider_book_url = provider['Practice Booking URL'];

  let btns = [];

  if (view_provider_site_url) {
    let btn = {
      title: 'Visit Provider Site',
      type: 'web_url',
      url: view_provider_site_url,
    }

    btns.push(btn);
  }

  if (view_provider_book_url) {
    let btn = {
      title: 'Visit Booking Site',
      type: 'web_url',
      url: view_provider_book_url,
    }

    btns.push(btn);
  }

  return btns;
}

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'] ? provider['Main Provider Image'][0].url : DEFAULT_PROVIDER_IMAGE;

  let provider_name = encodeURIComponent(provider['Practice Name']);
  let provider_base_id = provider['Practice Base ID'];
  let data = { provider_id, provider_base_id, provider_name, first_name, last_name, gender, messenger_user_id };
  let buttons = createButtons(provider, data);

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let createLastGalleryElement = () => {
  let title = 'More Options';
  let image_url = SEARCH_PROVIDERS_MORE_OPTIONS_IMAGE_URL;

  // Buttons
  let btn1 = {
    title: 'List My Practice',
    type: 'show_block',
    block_name: 'List Practice',
  }

  let btn2 = {
    title: 'Main Menu',
    type: 'show_block',
    block_name: 'Discover Main Menu',
  }

  let btn3 = {
    title: 'About Bevl Beauty',
    type: 'show_block',
    block_name: 'About Bevl Beauty',
  }

  let buttons = [btn1, btn2, btn3];

  let last_gallery_element = { title, buttons };
  return last_gallery_element;
}

module.exports = {
  searchProviders,
  getProviderByUserID,
  updateProvider,
  filterProvidersByService,
  sortProviders,
  toGalleryElement,
  createLastGalleryElement,
}