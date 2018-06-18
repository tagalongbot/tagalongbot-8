let { findService 
let { getAllProviders, filterProvidersByService } = require('../../../libs/data/providers.js');
let { getPracticePromos } = require('../../../libs/data/practice/promos.js');

let getServicePromos = async ({ query }, res) => {
  let { service_id, messenger_user_id, first_name, last_name, gender } = query;
  
  let service = await findService(service_id);
  let service_name = service.fields['Name'];
    
  let providers = await getAllProviders();
  
  let providers_with_service = filterProvidersByService(service_name, providers);
  
  let provider_promos = providers.map(async provider => {
    let provider_base_id = provider.fields['Practice Base ID'];
    
    let promos = await getPracticePromos({ provider_base_id });
    
    
    
  });
}

module.exports = getServicePromos;