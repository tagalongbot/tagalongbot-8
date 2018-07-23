let { BASEURL } = process.env;

let { createURL } = require('../libs/helpers.js');
let { getServiceByName } = require('../libs/data/services.js');

let findPromos = async ({ res, parameters, user }) => {
  let { messenger_user_id, first_name, last_name, gender } = user;

  let { brand_name, procedure, location, state, city, zip_code } = parameters;

  if (!zip_code && (state || city)) {
    let redirect_to_blocks = ['Zip Code Only Message', 'Search Promos'];
    res.send({ redirect_to_blocks });
    return;
  }

  if ( !zip_code && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).trim();
    let set_attributes = { service_name };
    let redirect_to_blocks = ['Search Promos'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  if ( !zip_code && (!brand_name && !procedure) ) {
    let redirect_to_blocks = ['Search Promos'];
    res.send({ redirect_to_blocks });
    return;
  }

  if ( zip_code && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).toLowerCase();
  
    let service = await getServiceByName({ service_name });
    let service_id = service.id;
    
    let redirect_url = createURL(
      `${BASEURL}/services/promos/${zip_code}`, 
      { service_id, ...user }
    );

    res.redirect(redirect_url);
    return;
  }

  if ( zip_code && (!brand_name && !procedure) ) {
    let redirect_url = createURL(
      `${BASEURL}/promos/search/${zip_code}`, 
      { ...user }
    );

    res.redirect(redirect_url);
    return;
  }
}

module.exports = findPromos;