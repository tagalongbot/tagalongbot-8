let { BASEURL, SERVICES_BASE_ID, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createURL } = require('../libs/helpers');
let { searchProviders } = require('../libs/providers');
let { toGalleryElement } = require('../libs/promos');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let getPromosTable = getTable('Promos');
let getServicesTable = getTable('Services');

let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let servicesTable = getServicesTable(SERVICES_BASE_ID);

let getPractices = getAllDataFromTable(practicesTable);
let getServices = getAllDataFromTable(servicesTable);

let findPromos = async ({ res, parameters, user }) => {
  let { first_name, last_name, messenger_user_id } = user;
  let { brand_name, procedure, location, state, city, zip_code } = parameters;

  let search_type = {
    [Boolean(state)]: 'state',
    [Boolean(city)]: 'city',
    [Boolean(zip_code)]: 'zip_code'
  }[true];

  if ( !search_type && (brand_name || procedure) ) {
    let redirect_to_blocks = ['Search Promos NLP (By Procedure)'];
    let procedure_name = (brand_name || procedure).trim();
    let set_attributes = { procedure_name };
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  if ( !search_type && (!brand_name && !procedure) ) {
    let redirect_to_blocks = ['Search Promos NLP (No Procedure)'];
    res.send({ redirect_to_blocks });
    return;
  }
  
  if ( search_type && (!brand_name && !procedure) ) {
    let redirect_url = createURL(`${BASEURL}/search/promos/${search_type}`, {
      
    });
    res.redirect(redirect_url);
    return;
  }

  let providers = await searchProviders({
    search_providers_state: state, 
    search_providers_city: city, 
    search_providers_zip_code: zip_code, 
  }, search_type);

  if (brand_name || procedure) {
    let filterByFormula = `OR({Capitalized Name} = '${brand_name.trim().toUpperCase()}', {Capitalized Name} = '${procedure.trim().toUpperCase()}')`;
    let [service] = await getServices({ filterByFormula });

    if (!service) {
      let redirect_to_blocks = ['Service Not Available'];
      res.send({ redirect_to_blocks });
      return;
    }

    let service_name = service.fields['Name'].toLowerCase();
    let providersWithService = providers.filter((provider) => {
      return provider.fields['Practice Services'].map(service => service.toLowerCase()).includes(service_name);
    });

    for (let provider of providersWithService) {
      let base_id = provider.fields['Practice Base ID'];
      let promosTable = getPromosTable(base_id);
      let getPromos = getAllDataFromTable(promosTable);

      let filterByFormula = `OR({Type} = '${brand_name.trim().toLowerCase()}, {Type} = '${procedure.trim().toLowerCase()}')`;
      let promos = await getPromos({ filterByFormula });
    }

  }
  
  
  
  
  
  
  if (!matchingPromos[0]) {
    let redirect_to_blocks = ['No Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let txtMsg = createTextMessage(`${first_name} here's what I found`);

  let galleryData = matchingPromos.map(toGalleryElement).slice(0, 5);
  let gallery = createGallery(galleryData);

  let messages = [txtMsg, gallery];
  res.send({ messages });
}

module.exports = findPromos;