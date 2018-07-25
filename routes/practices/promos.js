let { BASEURL } = process.env;

let { createURL } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/promos/promos.js');

let getPracticesPromos = async ({ query }, res) => {
  let { practice_id, messenger_user_id, first_name, last_name, gender } = query;
  
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

  let promosGalleryData = promos.map(
    toGalleryElement({ practice_id, practice_promos_base_id, first_name, last_name, gender, messenger_user_id })
  ).slice(0, 10);

  let messages = [
    createGallery(promosGalleryData)
  ];

  res.send({ messages });
}

module.exports = getPracticesPromos;