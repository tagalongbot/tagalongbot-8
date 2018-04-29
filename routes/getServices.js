let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL, shuffleArray } = require('../libs/helpers');
let { createGallery } = require('../libs/bots');

let { getTable, getAllDataFromTable } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServicesFromTable = getAllDataFromTable(servicesTable);

let searchServices = async (surgical_or_non_surgical) => {
	let filterByFormula = `{Surgical / Non Surgical} = '${surgical_or_non_surgical}'`;
  let services = await getServicesFromTable({ filterByFormula });
  return services;
}

let toGalleryElement = ({ id: service_id, fields: service }) => {
  let surgical_or_non_surgical = service['Surgical / Non Surgical'];
  let non_surgical_category = service[`${surgical_or_non_surgical} Category`];

  let title = service['Name'].slice(0, 80);
  let subtitle = `${surgical_or_non_surgical} | ${non_surgical_category} | ${service[non_surgical_category]}`;
  let image_url = service['Image URL'];

  let service_name = encodeURIComponent(service['Name']);
  let view_service_details_btn_url = createURL(`${BASEURL}/service/description/yes`, { service_id, service_name});
  let find_providers_btn_url = createURL(`${BASEURL}/service/providers`, { service_name });

  let btn1 = {
    title: 'View Service Details',
    type: 'json_plugin_url',
    url: view_service_details_btn_url,
  }

  let btn2 = {
    title: 'Find Providers',
    type: 'json_plugin_url',
    url: find_providers_btn_url,
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getServices = async ({ query, params }, res) => {
  let { service_type } = params;
  let first_name = query['first name'];
  let last_name = query['last name'];
  let gender = query['gender'];
  let messenger_user_id = query['messenger user id'];
  let data = { first_name, last_name, gender, messenger_user_id };

  if (service_type === 'surgical') {
    let surgical_services = await searchServices('Surgical');
    let surgical_services_gallery_data = surgical_services.map(toGalleryElement);
    let gallery = createGallery(surgical_services_gallery_data);
    let textMsg = { text: `Here's are the top surgical services` };
    let messages = [gallery];
    res.send({ messages });
    return;
  }

  let surgical_category_btn_url = createURL(`${BASEURL}/services/surgical`, data);
  let surgical_category_gallery_element = {
    title: 'Surgical Procedures',
    image_url: SURGICAL_SERVICES_IMAGE_URL,
    buttons: [{
      title: 'Learn More',
      type: 'json_plugin_url',
      web: surgical_category_btn_url,
    }]
  }

  let non_surgical_services = await searchServices('Non Surgical');
  let non_surgical_services_gallery_data = non_surgical_services.map(toGalleryElement(data)).slice(0, 8);
	let gallery = createGallery([surgical_category_gallery_element, ...non_surgical_services_gallery_data]);

  // Need to add load more mechanisim
  let textMsg = { text: `Here's are some services you can search for ${first_name}` };
	let messages = [textMsg, gallery];
	res.send({ messages });
}

let handleErrors = (req, res) => (error) => {
  console.log(error);
	let source = 'airtable';
	res.send({ source, error });
}

module.exports = (req, res) => {
	getServices(req, res)

	.catch(
		handleErrors(req, res)
	);
}