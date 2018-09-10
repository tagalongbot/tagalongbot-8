let localizeDate = (date) => {
  if (!date.valueOf()) return null;
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

module.exports = {
  localizeDate,
}