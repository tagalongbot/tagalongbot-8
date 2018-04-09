let { BASEURL } = process.env;
let { createTextMessage, createGallery } = require('../libs/bots');
let { getServices, getActivePromos } = require('../libs/data');

let toGalleryElement = (promo) => {
  let title = promo.promo_name.slice(0, 80);
  let subtitle = promo.promo_terms;
  let image_url = promo.promo_photo_uri;

  let btn1 = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: `${BASEURL}/promo/details?promo_id=${promo.promoid}`
  }

  let btn2 = {
    title: 'Find Promo Provider',
    type: 'json_plugin_url',
    url: `${BASEURL}/promo/providers?promo_id=${promo.promoid}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let findPromos = async ({ res, parameters, user}) => {
  let { first_name } = user;
  let { brand_name, procedure } = parameters;

  let services = await getServices();

  let servicesAskedFor = services.filter(({ service_name }) => {
    let serviceName = service_name.toLowerCase();
    let procedureName = procedure.toLowerCase();
    let brandName = brand_name.toLowerCase();

    return procedureName.includes(serviceName) || brandName.includes(serviceName); 
  });

  let servicesNumArr = servicesAskedFor.map((service) => service.serviceid);
    
  let activePromos = await getActivePromos();
  let matchingPromos = activePromos.filter(({ serviceid }) => servicesNumArr.includes(serviceid));

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