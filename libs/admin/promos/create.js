let createExpirationDate = (new_expiration_date_str) => {
  let dateMap = {
    '1 Week': 7,
    '2 Weeks': 14,
    '3 Weeks': 21,
    '4 Weeks': 28,
    '5 Weeks': 35,
    '6 Weeks': 42,
    '7 Weeks': 49,
    '8 Weeks': 56,
    '9 Weeks': 63,
    '10 Weeks': 70,
  }

  let today = new Date();

  let new_date = (new Date()).setDate(
    today.getDate() + dateMap[new_expiration_date_str]
  );

  return new_date;
}

module.exports = {
  createExpirationDate,
}