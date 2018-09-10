let fs = require('fs');
let { promisify } = require('util');
let appendFile = promisify(fs.appendFile);

let logError = async (error) => {
  let path = '.data/errors.txt';
  let date = new Date();
  let new_error = `\nNew Error: ${date.toString()}|${JSON.stringify(error)}`;
  let new_appended_error = await appendFile(path, new_error);
}

let logToFile = async (log_msg, file_name = 'logs.txt') => {
  let path = `.data/${file_name}`;
  let date = new Date();
  let new_log_msg = `\nNew Log: ${date.toString()}|${log_msg}`;
  let logged_message = await appendFile(path, new_log_msg);
}

module.exports = {
  logError,
  logToFile,
}