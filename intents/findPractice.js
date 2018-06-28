let { BASEURL } = process.env;

let { createURL } = require('../libs/helpers.js');

let findPractice = async ({ res, parameters, user }) => {
  let { first_name, last_name, gender, messenger_user_id } = user;
  let { state, city, zip_code, location, brand_name, procedure } = parameters;

  let search_type = {
    [Boolean(state)]: 'state',
    [Boolean(city)]: 'city',
    [Boolean(zip_code)]: 'zip_code'
  }[true];

  let data = {
    search_practices_state: state,
    search_practices_city: city,
    search_practices_zip_code: zip_code,
  }

  if ( !search_type && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).trim();
    let set_attributes = { service_name };
    let redirect_to_blocks = ['Search Practices NLP (By Service)'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  if ( !search_type && (!brand_name && !procedure) ) {
    let redirect_to_blocks = ['Search Practices NLP (No Procedure)'];
    res.send({ redirect_to_blocks });
    return;
  }

  if ( search_type && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).toLowerCase();

    let redirect_url = createURL(
      `${BASEURL}/practices/search/${search_type}`, 
      { service_name, ...user, ...data }
    );

    res.redirect(redirect_url);
    return;
  }

  if ( search_type && (!brand_name && !procedure) ) {
    let redirect_url = createURL(
      `${BASEURL}/practices/search/${search_type}`, 
      { ...user, ...data }
    );

    res.redirect(redirect_url);
    return;
  }
}

module.exports = findPractice;