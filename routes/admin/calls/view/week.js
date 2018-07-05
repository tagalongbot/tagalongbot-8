let riot = require('riot');
let week_tag = require('../../../../tags/calls/week-calls.tag');

let { getPracticeCalls } = require('../../../../libs/data/practice/calls.js');

let filterCallsThisWeek = ({ calls }) => {
  
}

let toCallData = ({ fields: call }) => {
  let call_name = 
  
  let new_call = {};
  return new_call;
}

let getCallsThisWeek = async () => {
  let all_practice_calls = await getPracticeCalls();

  let calls_this_week = filterCallsThisWeek(
    { calls: all_practice_calls }
  );
  
  let calls = calls_this_week.map(
    
  );
}

module.exports = getCallsThisWeek;