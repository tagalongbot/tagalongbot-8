let { BASEURL } = process.env;

let { localizeDate } = require('../../../libs/helpers.js');

let riot = require('riot');
let calls_list_tag = require('../../../tags/calls/calls-list.tag');

let { getPracticeByUserID } = require('../../../libs/data/practices.js');
let { getPracticeCalls } = require('../../../libs/data/practice/calls.js');

let toCallData = ({ practice_users_base_id, practice_promos_base_id }) => async ({ fields: call }) => {
  let user_messenger_id = call['messenger user id'];

  let caller_first_name = call['First Name'];
  let caller_last_name = call['Last Name'];

  let caller_name = `${caller_first_name} ${caller_last_name}`;

  let call_date = localizeDate(
    new Date(call['Date / Time Created'])
  );

  let call_url = `${BASEURL}`;

  return { caller_first_name, caller_last_name, caller_name, call_date };
}

let getCallsList = async ({ query, params }, res) => {
  let { messenger_user_id } = query;
  let { range } = params;

  let practice = await getPracticeByUserID(messenger_user_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_calls_base_id = practice.fields['Practice Calls Base ID'];
  let practice_users_base_id = practice.fields['Practice Users Base ID'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let view = (range === 'week') ? 'Calls This Week' : 'Calls This Month';

  let calls_this_week = await getPracticeCalls(
    { practice_calls_base_id, view }
  );

  let calls = await Promise.all(calls_this_week.map(
    toCallData({ practice_users_base_id, practice_promos_base_id })
  ));

  let view_html = riot.render(calls_list_tag, { calls });
  res.render('calls-list', { view_html, practice_name });
}

module.exports = getCallsList;