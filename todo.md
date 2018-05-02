## Routes
`getProviders.js`
  - Make sure sort algorithim is correct (**LINE 114-118**)
  - Make last element in gallery for
    1. List My Practice
    2. Main Menu
    3. About Bevl Beauty

`getServices.js`
  - Make loading more services work or load all services
  - Make multiple gallery method in `helpers.js`

`listPractice.js`
  - Make a list practice endpoint
  - Make it a button to the last gallery element when searching practices

## Libraries
- Create methods for `routes/` so redundent code can be removed encapsulating reading / writing data

`libs/promos.js`
  - Create promo library to use anywhere that promo methods are used

`libs/providers.js`
  - Create providers library to use anywhere that provider methods are used

`libs/users.js`
  - Create users library to use anywhere that user methods are used

`libs/services.js`
  - Create services library to use anywhere that service methods are used

## Create Admin Routes
  - Managing Promotions
    - Default Promotion Types
    - Updating Promo Info
    - Activate / Deactivate Promos (Collecting Info)
        - Expiration Date
        - Total Claim Limit
  - Getting User Info