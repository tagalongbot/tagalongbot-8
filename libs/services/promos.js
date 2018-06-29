let { getPracticesByState, getPracticesByCity } = require('../../libs/data/practices.js');

let getPractices = async (data) => {
  let { search_service_promos_state: state_name, search_service_promos_city: city_name } = data;

  if (state_name) {
    let practices = await getPracticesByState({ state_name, active: true });
    return practices;
  }
  
  if (city_name) {
    let practices = await getPracticesByCity({ city_name, active: true });
    return practices;
  }
}

module.exports = {
  getPractices,
}