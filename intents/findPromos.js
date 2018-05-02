let { BASEURL } = process.env;
let { createURL } = require('../libs/helpers');

let findPromos = async ({ res, parameters, user }) => {
  let { first_name, last_name, gender, messenger_user_id } = user;
  let { brand_name, procedure, location, state, city, zip_code } = parameters;

  // console.log('Parameters', parameters);
  // console.log('User:', user);

  let search_type = {
    [Boolean(state)]: 'state',
    [Boolean(city)]: 'city',
    [Boolean(zip_code)]: 'zip_code'
  }[true];

  // console.log('Search Type:', search_type);

  let data = {
    search_promos_state: state,
    search_promos_city: city,
    search_promos_zip_code: zip_code,
  }

  if ( !search_type && (brand_name || procedure) ) {
    let redirect_to_blocks = ['Search Promos NLP (By Procedure)'];
    let service_name = (brand_name || procedure).trim();
    let set_attributes = { service_name };
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
    let redirect_url = createURL(`${BASEURL}/search/promos/${search_type}`, { service_name, ...user, ...data });
    res.redirect(redirect_url);
    return;
  }

  if ( search_type && (!brand_name && !procedure) ) {
    let redirect_url = createURL(`${BASEURL}/search/promos/${search_type}`, { ...user, ...data });
    res.redirect(redirect_url);
    return;
  }
}

module.exports = findPromos;