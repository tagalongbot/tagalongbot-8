let { createTextMessage } = require('../libs/bots');
let { getServices } = require('../libs/data');

let defineProduct = async({ res, parameters, user }) => {
  let { brandname, procedureorproductcategory } = parameters;
  let services = await getServices();
  
  let service = services
    .find((service) => {
      let serviceName = service.service_name.toLowerCase();
      let brandName = brandname.toLowerCase();
      let procedure = procedureorproductcategory.toLowerCase();
      
      return serviceName.includes(brandName) || serviceName.includes(procedure);
    });
  
  let txtMsg = createTextMessage(service.long_description);
  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = defineProduct;