let { BASEURL } = process.env;

let { createURL } = require('../libs/helpers.js');
let { getServiceByName } = require('../libs/data/services.js');

let findPractice = async ({ res, parameters, user }) => {
  let { first_name, last_name, gender, messenger_user_id } = user;
  let { state, city, zip_code, location, brand_name, procedure } = parameters;

  if (!zip_code && (state || city)) {
    let redirect_to_blocks = ['Search Practices (Zip Code Only)'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (!zip_code && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).trim();
    let set_attributes = { service_name };
    let redirect_to_blocks = ['Search Practices NLP (By Service)'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  if ( !zip_code && (!brand_name && !procedure) ) {
    let redirect_to_blocks = ['Search Practices NLP (No Procedure)'];
    res.send({ redirect_to_blocks });
    return;
  }

  if ( zip_code && (brand_name || procedure) ) {
    let service_name = (brand_name || procedure).toLowerCase();

    let service = await getServiceByName({ service_name });
    let service_id = service.id;

    let redirect_url = createURL(
      `${BASEURL}/services/practices/${zip_code}`,
      { service_id, ...user }
    );

    res.redirect(redirect_url);
    return;
  }

  if ( zip_code && (!brand_name && !procedure) ) {
    let redirect_url = createURL(
      `${BASEURL}/practices/search/${zip_code}`, 
      { ...user }
    );

    res.redirect(redirect_url);
    return;
  }
}

module.exports = findPractice;