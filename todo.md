# Code

### Important and Urgent
- Create caching system for reading from Airtable
- Implement RateLimiter
- Update `/admin/promos/update` routes to work with numbers for claim limit, and image gallery for images

### Important and Less Urgent
- Update ChatFuel Block Names
- Update code to use ChatFuel blocks for responses by setting attributes, and linking button names to blocks that call JSON plugins instead of using `json_plugin_url`
- Create a middleware that checks for required `query` parameters
- Pass `BASEURL` to all functions that use it without being passed to make those functions PURE
- Refactor code from `providers` to `practices`
- Figure out how to configure ESLint to ignore `new Set()`