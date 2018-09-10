let { getRunnerByMessengerID, getRunnersByZipCode } = require('../libs/data/runners.js');

let searchRunners = async ({ params, query }, res) => {
  let { zip_code } = params;
  let { messenger_user_id, first_name, last_name, gender } = query;
  
  let runners = await getRunnersByZipCode(
    { zip_code }
  );
  
  
  
}

module.exports = searchRunners;