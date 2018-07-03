let fs = require('fs');
let { promisify } = require('util');

let readFile = promisify(fs.readFile);

let getFile = async ({ params }, res) => {
  let { file_path } = params;
  let file = await readFile(`.data/${file_path}`);
  res.send(file.toString());
}

module.exports = getFile;