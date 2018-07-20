let { BASEURL } = process.env;

let { createURL } = require('../libs/helpers.js');
let { getServiceByName } = require('../libs/data/services.js');

let findPromos = async ({ res, parameters, user }) => {
  let { messenger_user_id, first_name, last_name, gender } = user;

  let { brand_name, procedure, location, state, city, zip_code } = parameters;


  let data = {
    search_promos_state: state,
    search_promos_city: city,
    search_promos_zip_code: zip_code,
  }

  if ( !search_type && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).trim();
    let set_attributes = { service_name };
    let redirect_to_blocks = ['Search Promos NLP (By Service)'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  if ( !search_type && (!brand_name && !procedure) ) {
    let redirect_to_blocks = ['Search Promos NLP (No Procedure)'];
    res.send({ redirect_to_blocks });
    return;
  }

  if ( search_type && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).toLowerCase();
  
    let service = await getServiceByName({ service_name });
    let service_id = service.id;
    
    let redirect_url = createURL(
      `${BASEURL}/services/promos`, 
      { service_id, ...user, ...data }
    );

    res.redirect(redirect_url);
    return;
  }

  if ( search_type && (!brand_name && !procedure) ) {
    let redirect_url = createURL(
      `${BASEURL}/promos/search/${search_type}`, 
      { ...user, ...data }
    );

    res.redirect(redirect_url);
    return;
  }
}

module.exports = findPromos;