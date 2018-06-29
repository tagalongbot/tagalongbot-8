# Code
- Update code to use ES6 Modules using `graspjs`

- Update code to use ChatFuel blocks for responses by setting attributes, and linking button names to blocks that call JSON plugins instead of using `json_plugin_url`

- Refactor `/libs/practices/practices.js` to be more declarative

- Create a middleware that checks for required `query` parameters

- Refactor Intents and `ai.js` to be more declarative

- Update ChatFuel Block Names

- Pass `BASEURL` to all functions that use it without being passed to make those functions PURE

- Figure out how to configure ESLint to ignore `new Set()`