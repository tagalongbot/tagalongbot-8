let { BASURL } = process.env;

let riot = require('riot');
let week_tag = require('../../../../tags/calls/week-calls.tag');

let { getPracticeByUserID } = require('../../../../libs/data/practices.js');
let { getPracticeCalls } = require('../../../../libs/data/practice/calls.js');

let filterCallsThisWeek = ({ calls }) => {
  let today = new Date();

  let calls_this_week = calls.map((call) => {
    let call_date = call.fields['Date / Time Created'];
    console.log('call_date', call_date);
    return true;
  });

  return calls_this_week;
}

let toCallData = ({ fields: call }) => {
  let caller_first_name = call['First Name'];
  let caller_last_name = call['Last Name'];

  let caller_name = `${caller_first_name} ${caller_last_name}`;

  let call_url = `${BASURL}`;

  let new_call = { caller_first_name, caller_last_name, caller_name };
  return new_call;
}

let getCallsThisWeek = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let practice = await getPracticeByUserID(messenger_user_id);
  let practice_calls_base_id = practice.fields['Practice Calls Base ID'];

  let all_practice_calls = await getPracticeCalls({ practice_calls_base_id });
  console.log('all_practice_calls', all_practice_calls);

  let calls_this_week = filterCallsThisWeek(
    { calls: all_practice_calls }
  );

  let calls = calls_this_week.map(
    toCallData
  );

  let view_html = riot.render(week_tag, { calls });
  res.render('week-calls', { view_html });
}

module.exports = getCallsThisWeek;