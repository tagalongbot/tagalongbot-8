# Airtable
- Delete "Terms" field in promotions bases
- Restructure the way manufactured and custom promotions images and details are managed

# Code

## Important and Urgent
- Finish passing `data` to different routes with explicitness
- Check if `gender` query parameter error still occurs
  - `/routes/promos/details.js`
  - `/routes/promos/provider.js`
  - `/routes/providers/promos.js`
- Work on Error Handling
- Update the way manufactured and custom promotions are created
- Create a way to find promos based of `service_name`
- Create a logging system

## Important But Not Urgent
- Create a middleware that checks for required `query` parameters
- Pass `BASEURL` to all functions that use it without being passed to make those functions PURE
- Rename `providers` to `practices`