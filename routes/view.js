let { BASEURL } = process.env;

let { localizeDate, formatPhoneNumber } = require('../libs/helpers.js');

let riot = require('riot');
let DATA_LIST_TAG = require('../tags/data/data-list.tag');

let { getAllData, getDataByID } = require('../libs/data/something.js');

let toData = ({  }) => ({ fields: data }) => {
  let user_messenger_id = data['messenger user id'];

  let data_obj = {
    ['name']: ``,
  }
  
  return data_obj;
}

let getDataList = async ({ query, params }, res) => {
  let { messenger_user_id } = query;
  let { range } = params;

  let data = await getDataByID(messenger_user_id);

  let view = ``;

  let found_data = await getAllData(
    { view }
  );

  let data_list = found_data.map(
    toData({  })
  );

  let data_html = riot.render(
    DATA_LIST_TAG,
    { data_list }
  );

  let view_html = ``;

  res.render(
    'data-tag',
    { view_html }
  );
}

module.exports = getDataList;