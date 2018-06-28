# Code

### Important and Urgent
- Update ChatFuel Block names from "Provider" to "Practice"
- Update code to use separate functions for searching by state and city
  -- I got rid of `searchProviders` / `searchPractices` function
- Use ES6 Import Modules

### Important and Less Urgent
- Create a middleware that checks for required `query` parameters
- Update ChatFuel Block Names
- Update code to use ChatFuel blocks for responses by setting attributes, and linking button names to blocks that call JSON plugins instead of using `json_plugin_url`
- Pass `BASEURL` to all functions that use it without being passed to make those functions PURE
- Figure out how to configure ESLint to ignore `new Set()`