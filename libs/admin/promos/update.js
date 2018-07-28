let { localizeDate } = require('../../../libs/helpers.js');
let { createExpirationDate } = require('../../../libs/admin/promos/create.js');
let { createBtn, createButtonMessage } = require('../../../libs/bots.js');
let { updatePracticePromo } = require('../../../libs/data/practice/promos.js');

let toCategoriesGallery = (data) => ({ id: category_id, fields: category }) => {
  let { promo_id, practice_promos_base_id } = data;

  let title = category['Category Name'];
  let image_url = category['Image URL'];

  let btn1 = createBtn(
    `View Category Images|show_block|[JSON] View Category Images (Update Promo)`,
    { promo_id, practice_promos_base_id, category_id }
  );

  let buttons = [btn1];

  return { title, image_url, buttons };
}

let toImagesGallery = ({ id: promo_id, fields: promo }) => ({ id: custom_image_id, fields: custom_image }) => {
  let expiration_date = localizeDate(
    new Date(promo['Expiration Date'])
  );

  let title = promo['Promotion Name'];
  let subtitle = `Valid Until ${expiration_date}`;
  let image_url = custom_image['Image URL'];
  let new_promo_image_id = promo_id;

  let select_image_btn = createBtn(
    `Use This Image|show_block|[JSON] Select Image (Update Promo)`,
    { custom_image_id }
  );

  let buttons = [select_image_btn];

  return { title, subtitle, image_url, buttons };
}

let updatePromo = async (data) => {
  let { practice_promos_base_id, promo, update_promo_field_name, update_promo_field_value } = data;

  let promo_field_value = (update_promo_field_name === 'Claim Limit') ? 
    Number(update_promo_field_value) :
    update_promo_field_value;

  let promo_data = {
    [update_promo_field_name]: promo_field_value
  }

  let updatedPromo = await updatePracticePromo(
    { practice_promos_base_id, promo_data, promo }
  );

  return updatedPromo;
}

let createUpdateMsg = (data) => {
  let {
    promo_id,
    practice_promos_base_id,
    promo,
    updatedPromo,
    update_promo_field_name,
    update_promo_field_value
  } = data;

  let old_promo_name = promo.fields['Promotion Name'];
  let new_toggle_btn_name = updatedPromo.fields['Active?'] ? 'Deactivate' : 'Activate';

  let text = (update_promo_field_name === 'Image URL') ?
    `Image Updated Successfully for ${old_promo_name}` :
    `Updated ${update_promo_field_name} to "${update_promo_field_value}" for ${old_promo_name}`;

  let view_promo_details_btn = createBtn(
    `View Promo Details|show_block|[JSON] View Promo Info`,
    { promo_id, practice_promos_base_id }
  );

  let update_promo_btn = createBtn(
    `Update Promo|show_block|[JSON] Update Promo`,
    { promo_id, practice_promos_base_id }
  );

  let toggle_promo_btn = createBtn(
    `${promo['Active?'] ? 'Deactivate' : 'Activate'}|show_block|[JSON] Toggle Promo`,
    { promo_id, practice_promos_base_id }
  );

  let msg = createButtonMessage(
    text,
    view_promo_details_btn,
    update_promo_btn,
    toggle_promo_btn
  );

  return msg;
}

module.exports = {
  toCategoriesGallery,
  toImagesGallery,
  updatePromo,
  createUpdateMsg,
}