let { searchPractices } = require('../../libs/data/practices.js');

let getPractices = async (data) => {
  let { search_type, search_service_promos_state, search_service_promos_city, search_service_promos_zip_code } = data;

  let search_practices_state = search_service_promos_state;
  let search_practices_city = search_service_promos_city;
  let search_practices_zip_code = search_service_promos_zip_code;
  
  let practices = await searchPractices(
    { search_type },
    { search_practices_state, search_practices_city, search_practices_zip_code }
  );
  
  return practices;
}

module.exports = {
  getPractices,
}