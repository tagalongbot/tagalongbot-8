let { sendErrorMsg } = require('../libs/telegram.js');

let { logToFile } = require('../libs/helpers/errors.js');

let errorHandler = (block_name, res) => async (error) => {
  console.log(error);

  let errorMsg = `${block_name}: ${JSON.stringify(error)}`;
  logToFile(errorMsg, 'errors.txt');

  await sendErrorMsg(errorMsg);

  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let handleRoute = (routeFn, block_name) => (req, res) => {
  routeFn(req, res)

  .catch(
    errorHandler(block_name, res)
  );
}

module.exports = handleRoute;