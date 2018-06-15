let requiredParameters = (parameters) => ({ query }, res) => {
  let queryKeys = Object.keys(query);
  let error = 'Missing Query Parameter';

  for (let key of queryKeys) {
    if (!parameters.includes(key)) {
      res.send({ error, query_parameter: key });
      break;
    }
  }
}

module.exports = requiredParameters;