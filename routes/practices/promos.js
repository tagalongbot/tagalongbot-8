let { createGallery } = require('../../libs/bots.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/promos/promos.js');

let getPracticesPromos = async ({ query }, res) => {
  let { practice_id, messenger_user_id, first_name, last_name, gender } = query;

  let index = Number(query.index) || 0;
  let new_index = index + 8;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promos = await getPracticePromos(
    { practice_promos_base_id }
  );  

  if (!promos[0]) {
    let set_attributes = { practice_name };
    let redirect_to_blocks = ['No Practice Promos Found'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let promos_gallery_array = promos.slice(index, new_index).map(
    toGalleryElement({ practice_id, practice_promos_base_id, first_name, last_name, gender, messenger_user_id })
  ).slice(0, 9);

  if ( new_index < promos_gallery_array.length )  {
    let last_gallery_element = createLastGalleryElement(
      { index }
    );

    promos_gallery_array.push(last_gallery_element);
  }
  
  let messages = [
    createGallery(promos_gallery_array)
  ];

  res.send({ messages });
}

module.exports = getPracticesPromos;