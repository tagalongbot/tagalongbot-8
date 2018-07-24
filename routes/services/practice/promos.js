let { getPracticeByID } = require('../../../libs/data/practices.js');
let { getServiceByID } = require('../../../libs/data/services.js');
let { getServicePromos, createNoPromosMsg } = require('../../../libs/services/practice/promos.js');

let { toGalleryElement } = require('../../../libs/promos/promos.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let getServicePracticePromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, service_id, practice_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let promos = await getServicePromos(
    
  );

  if (!promos[0]) {
    let msg = createNoPromosMsg(
      { first_name, service_name, practice_id, practice_name }
    );

    let messages = [msg];
    res.send({ messages });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ practice_id, practice_promos_base_id, first_name, last_name, gender, messenger_user_id })
  );

  let text = `Here are some ${service_name} promos by ${practice_name}`;
  let messages = [
    { text },
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

module.exports = getServicePracticePromos;