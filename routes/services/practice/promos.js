let { getPracticeByID } = require('../../../libs/data/practices.js');
let { getServiceByID } = require('../../../libs/data/services.js');
let { getServicePromos, createNoPromosMsg } = require('../../../libs/services/practice/promos.js');

let { toGalleryElement, createLastGalleryElement } = require('../../../libs/promos/promos.js');
let { createMultiGallery } = require('../../../libs/bots.js');

let getServicePracticePromos = async ({ query }, res) => {
  let { service_id, practice_id } = query;
  
  let index = Number(query.index) || 0;
  let new_index = index + 8;

  let service = await getServiceByID(
    { service_id }
  );

  let service_name = service.fields['Name'];

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promos = await getServicePromos(
    { service, practice }
  );

  if (!promos[0]) {
    let msg = createNoPromosMsg(
      { service, practice }
    );

    let messages = [msg];
    res.send({ messages });
    return;
  }

  let promos_gallery_array = promos.slice(index, new_index).map(
    toGalleryElement({ practice_id, practice_promos_base_id })
  );

  if ( new_index < promos.length )  {
    let last_gallery_element = createLastGalleryElement(
      { practice_id, index }
    );

    promos_gallery_array.push(last_gallery_element);
  }

  let messages = [
    { text: `Here are some ${service_name} promos by ${practice_name}` },
    ...createMultiGallery(promos_gallery_array)
  ];

  res.send({ messages });
}

module.exports = getServicePracticePromos;