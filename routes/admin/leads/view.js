let { BASEURL } = process.env;

let { localizeDate } = require('../../../libs/helpers.js');

let riot = require('riot');
let leads_list_tag = require('../../../tags/leads/leads-list.tag');

let { getPracticeByUserID } = require('../../../libs/data/practices.js');
let { getPracticeLeads } = require('../../../libs/data/practice/leads.js');

let toLeadData = ({ practice_promos_base_id }) => async ({ fields: lead }) => {
  let user_messenger_id = lead['messenger user id'];

  let call_date = localizeDate(
    new Date(lead['Call Date / Time'])
  );

  let lead_obj = {
    ['name']: `${lead['First Name']} ${lead['Last Name']}`,
    ['gender']: lead['Gender'],
    ['phone_number']: lead['Phone Number'],
    ['call_date']: call_date,
    ['promotion_name']: lead['Promotion Name'],
    ['recording_url']: lead['Recording URL'],
  }

  return lead_obj;
}

let getLeadsList = async ({ query, params }, res) => {
  let { messenger_user_id } = query;
  let { range } = params;

  let practice = await getPracticeByUserID(messenger_user_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_calls_base_id = practice.fields['Practice Calls Base ID'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let view = (range === 'week') ? 'Calls This Week' : 'Calls This Month';

  let leads_this_week = await getPracticeLeads(
    { practice_calls_base_id, view }
  );

  let leads = await Promise.all(leads_this_week.map(
    toLeadData({ practice_promos_base_id })
  ));

  let view_html = riot.render(leads_list_tag, { leads });
  res.render('leads-list', { view_html, practice_name });
}

module.exports = getLeadsList;