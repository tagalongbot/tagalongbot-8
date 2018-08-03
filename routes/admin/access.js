let handleRoute = require('../../middlewares/handleRoute.js');

let { formatPhoneNumber } = require('../../libs/helpers.js');

let { getAllData, updateData } = require('../../libs/data/something.js');

let { handleVerifyPhoneNumberRoute, handleVerifyVerificationCode } = require('../../libs/twilio-routes.js');

let express = require('express');
let router = express.Router();

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;

  let response = await handleVerifyPhoneNumberRoute(
    { phone_number, block_name: 'Admin Access Granted' }
  );

  res.send(response);
}

let verifyVerificationCode = async ({ query }, res) => {
  let { user_phone_number: phone_number, verification_code } = query;

  let response = await handleVerifyVerificationCode(
    { phone_number, verification_code, block_name: 'Admin Access Granted' }
  );

  res.send(response);
}

let getAdminAccess = async ({ query }, res) => {
  let { messenger_user_id, user_phone_number } = query;

  let filterByFormula = `{Main Provider Phone Number} = '${formatPhoneNumber(user_phone_number)}'`;

  let [practice] = await getAllData(
    { filterByFormula }
  );
  
  let update_data = {
    ['Main Provider Messenger ID']: messenger_user_id
  }

  let updated_practice = await updateData(update_data, practice);

  let redirect_to_blocks = ['Admin Access Granted'];

  res.send({ redirect_to_blocks });
}

router.get(
  '/verify',
  handleRoute(verifyPhoneNumber, '[Error] Admin')
);

router.get(
  '/verify/code',
  handleRoute(verifyVerificationCode, '[Error] Admin')
);

router.get(
  '/',
  handleRoute(getAdminAccess, '[Error] Admin')
);

module.exports = router;