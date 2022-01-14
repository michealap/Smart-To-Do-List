## Smarties - To-Do_List
An autocategorizing SPA with hover animation. User enters a task and the API does the work 99% of the time. 
For that 1%, there are draggable list items. 

### Log In View
!["Screenshot of logged in user"](https://github.com/michealap/Smart-To-Do-List/blob/master/docs/checked.png)

### Getting Started
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
  -API keys: eg. `omdb API key`
  *Requires the following API keys in .env file: Omdb, Google, Spoon
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

### Search field is blank
!["Screenshot of form verify"](https://github.com/michealap/Smart-To-Do-List/blob/master/docs/formVerify.png)

### Log Out View
!["Screenshot of logged out user"](https://github.com/michealap/Smart-To-Do-List/blob/master/docs/loggedout.png)

### Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Pg-native
- Axios 
- cookie-session
- Chalk
- dotenv
- Ejs
- Express
- Jquery-UI
- morgan
- sass
- Node-sass-middleware
