let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, findTableData, updateTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');

let claimPromotion = ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id } = query;
  
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = findPromo(promo_id);
  
  if (!promo) {
    let red
  }
}

module.exports = claimPromotion;