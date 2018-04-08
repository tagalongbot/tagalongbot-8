let { BASEURL } = process.env;
let { createTextMessage, createGallery } = require('../libs/bots');
let { getServices } = require('../libs/data');

let defineProduct = async({ res, parameters, user }) => {
  let { brandname, procedureorproductcategory } = parameters;
  let services = await getServices();
  let service = services
    .find((service_name) => {
      let serviceName
      
      return service_name.toLowerCase().includes(brandname.toLowerCase()) || service_name.toLowerCase().includes(procedureorproductcategory.toLowerCase()));
      
    });
}

module.exports = defineProduct;