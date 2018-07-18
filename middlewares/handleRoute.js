let { sendErrorMsg } = require('../libs/telegram.js');

let { logToFile } = require('../libs/helpers.js');

let errorHandler = (block_name, res) => async (error) => {
  console.log(error);
  logToFile(`${block_name}`, 'errors.txt');
  sendErrorMsg(block_name);

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