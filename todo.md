# Airtable

### Important and Urgent
### Important and Less Urgent

# Code

### Important and Urgent
- Update the way manufactured and custom promotions are created using Airtable form setup to redirect to server endpoint and send user message
- Create a way to find promos from `Services Carousel`
- Update any files using `findService` to use `getServiceByID`
- Work on Error Handling
- Create a logging system
- Create caching system for reading from Airtable

### Important and Less Urgent
- Update ChatFuel Block Names
- Update code to use ChatFuel blocks for responses by setting attributes, and linking button names to blocks that call JSON plugins instead of using `json_plugin_url`
- Create a middleware that checks for required `query` parameters
- Pass `BASEURL` to all functions that use it without being passed to make those functions PURE
- Rename `providers` to `practices`
- Figure out how to configure ESLint to ignore `new Set()`