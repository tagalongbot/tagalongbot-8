let getFile = async ({ query }, res) => {
  let { file_path } = query;
  res.sendFile(`${file_path}`, { root: '.data' });
}

module.exports = getFile;