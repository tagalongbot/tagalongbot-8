let { getPracticeByID } = require('../../libs/data/practices.js');
let { getAllServices, filterServicesFromPractice } = require('../../libs/data/services.js');

let { toGalleryElement } = require('../../libs/practices/services.js');
let { createMultiGallery } = require('../../libs/bots.js');

let getPracticeServices = async ({ query }, res) => {
  let { practice_id, first_name, last_name, gender, messenger_user_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let services = await getAllServices();

  let services_from_practice = filterServicesFromPractice({ services, practice });

  if (!services_from_practice[0]) {
    // Should never happen
    // All practices should have services
    let redirect_to_blocks = ['[Error] User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let servicesGalleryData = services_from_practice.slice(0, 9).map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender, practice_id, practice_name })
  );

  let servicesGallery = createMultiGallery(servicesGalleryData, 10, 'square');
  let text = `Here are the services provided by ${practice_name}`;
  let messages = [{ text }, ...servicesGallery];
  res.send({ messages });
}

module.exports = getPracticeServices;