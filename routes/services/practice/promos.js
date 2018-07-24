let { getPracticeByID } = require('../../../libs/data/practices.js');
let { getServiceByID } = require('../../../libs/data/services.js');
let { getServicePromos, createNoPromosMsg } = require('../../../libs/services/practice/promos.js');

let { toGalleryElement } = require('../../../libs/promos/promos.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let getServicePracticePromos = async ({ query }, res) => {
  let { service_id, practice_id, messenger_user_id, first_name, last_name, gender } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promos = await getServicePromos(
    { service, practice }
  );

  if (!promos[0]) {
    let msg = createNoPromosMsg(
      { first_name, service, practice }
    );

    let messages = [msg];
    res.send({ messages });
    return;
  }

  let galleryData = promos.map(
    toGalleryElement({ practice_id, practice_promos_base_id, messenger_user_id, first_name, last_name, gender })
  );

  let text = `Here are some ${service_name} promos by ${practice_name}`;
  let messages = [
    { text },
    ...createMultiGallery(galleryData)
  ];

  res.send({ messages });
}

module.exports = getServicePracticePromos;