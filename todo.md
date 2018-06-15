# Airtable
- Delete "Terms" field in promotions bases
- Restructure the way manufactured and custom promotions images and details are managed

# Code
- Check if `gender` query parameter error still occurs
  - `/routes/promos/details.js`
  - `/routes/promos/provider.js`
  - `/routes/providers/promos.js`
- Work on Error Handling
- Create a middleware that checks for required `query` parameters
- Update the way manufactured and custom promotions are created
- Pass `BASEURL` to all functions that use it without being passed to make those functions PURE
- Create a logging system
- Create a way to find promos based of `service_name`
- Rename `providers` to `practices`