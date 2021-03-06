let updateQueryParameter = ({ query }, res, next) => {
  let keys = Object.keys(query);
  
  for (let key of keys) {
    let underscored_key = key.replace(/\s/g, '_');
    query[underscored_key] = query[underscored_key] || query[key];
  }

  next();
}

module.exports = updateQueryParameter;