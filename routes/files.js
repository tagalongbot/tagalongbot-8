let fs = require('fs');
let { promisify } = require('util');

let readFile = promisify(fs.readFile);

let getFile = async ({ query }, res) => {
  console.log('query', query);
  let { file_path } = query;
  let file = await readFile(`.data/${file_path}`);
  console.log('file', file);
  res.send(file);
}

module.exports = getFile;