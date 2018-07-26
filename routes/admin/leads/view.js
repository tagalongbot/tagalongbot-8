let { BASEURL } = process.env;

let { localizeDate } = require('../../../libs/helpers.js');

let riot = require('riot');
let leads_list_tag = require('../../../tags/leads/leads-list.tag');

let { getPracticeByUserID } = require('../../../libs/data/practices.js');
let { getPracticeLeads } = require('../../../libs/data/practice/leads.js');

let toLeadData = ({ practice_promos_base_id }) => ({ fields: lead }) => {
  let user_messenger_id = lead['messenger user id'];

  let lead_obj = {
    ['name']: `${lead['First Name']} ${lead['Last Name']}`,
    ['gender']: lead['Gender'],
    ['phone_number']: lead['Phone Number'],
    ['promotion_name']: lead['Claimed Promotion Name'],
    ['initiated_call']: lead['Call Initiated'],
  }

  let call_date = localizeDate(
    new Date(lead['Call Date / Time'])
  );

  let follow_up_1_date = localizeDate(
    new Date(lead['Follow Up #1'])
  );

  let follow_up_2_date = localizeDate(
    new Date(lead['Follow Up #2'])
  );

  if (call_date) {
    lead_obj['call_date'] = call_date;

    if (lead['Recording Duration']) {
      lead_obj['call_duration'] = lead['Recording Duration'];
    }

    if (lead['Recording URL']) {
      lead_obj['recording_url'] = lead['Recording URL'];
    }
  }

  if (follow_up_1_date) {
    lead_obj['follow_up_1_date'] = follow_up_1_date;
    lead_obj['follow_up_1_notes'] = lead['Follow Up #1 Notes'];
  }

  if (follow_up_2_date) {
    lead_obj['follow_up_2_date'] = follow_up_2_date;
    lead_obj['follow_up_2_notes'] = lead['Follow Up #2 Notes'];
  }

  return lead_obj;
}

let getLeadsList = async ({ query, params }, res) => {
  let { messenger_user_id } = query;
  let { range } = params;

  let practice = await getPracticeByUserID(messenger_user_id);

  let practice_name = practice.fields['Practice Name'];
  let practice_leads_base_id = practice.fields['Practice Leads Base ID'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let view = (range === 'week') ? 'Leads This Week' : 'Leads This Month';

  let found_leads = await getPracticeLeads(
    { practice_leads_base_id, view }
  );
  
  // Called Leads
  let called_leads = found_leads.filter(
    (lead) => lead.fields['Initiated Call'] === 'YES'
  );

  let called_leads_data = found_leads.map(
    toLeadData({ practice_promos_base_id })
  );

  let called_leads_html = riot.render(
    leads_list_tag,
    { leads: called_leads_data }
  );
  
  let non_called_leads = found_leads.filter(
    (lead) => lead.fields['Initiated Call'] === 'NO'
  );

  let non_called_leads_data = found_leads.map(
    toLeadData({ practice_promos_base_id })
  );
  
  let non_called_leads_html = riot.render(
    leads_list_tag,
    { leads: non_called_leads_data }
  );

  let vie
  
  res.render(
    'leads-list', 
    { view_html, practice_name }
  );
}

module.exports = getLeadsList;