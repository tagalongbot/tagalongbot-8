let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { getServices } = require('../libs/data');

let defineProduct = async({ res, parameters, user }) => {
  let { brandname, procedureorproductcategory } = parameters;
  let services = await getServices();
  
  let service = services.find((service) => {
    let serviceName = service.service_name.toLowerCase();
    let brandName = brandname.toLowerCase();
    let procedure = procedureorproductcategory.toLowerCase();
    console.log(serviceName, brandName, procedure);

    return serviceName.includes(brandName) || serviceName.includes(procedure);
  });
  
  if (!service) {
    let redirect_to_blocks = ['No Service Found'];
    res.send({ redirect_to_blocks });
    return;
  }
  
  let txtMsg = createButtonMessage(
    service.long_description,
    `Find Providers|json_plugin_url|${BASEURL}/service/providers?service_id=${service.serviceid}`
  );
  
  // console.log(service);
  
  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = defineProduct;