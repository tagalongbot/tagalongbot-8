let { searchProviders } = require('../../libs/data/providers.js');

let getProviders = async (data) => {
  let { search_type, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = data;

  let search_providers_state = search_service_providers_state;
  let search_providers_city = search_service_providers_city;
  let search_providers_zip_code = search_service_providers_zip_code;
  
  let providers = await searchProviders(
    { search_type },
    { search_providers_state, search_providers_city, search_providers_zip_code }
  );
  
  return providers;
}

module.exports = {
  getProviders,
}