let trainAI = async ({ query, body }, res) => {
  console.log('query', query);
  console.log('body', body);
  
  res.sendStatus(200);
}

module.exports = trainAI;