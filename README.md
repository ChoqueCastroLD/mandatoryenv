## Mandatory Env

Find loads and verifies your enviroment variables wherever they are! (.env files for example)


https://www.npmjs.com/package/mandatoryenv


·Disclaimer: This module uses dotenv in the background, adding only extra checking for the variables it loads.



Example usage:
````javascript
// *** .env < Be careful with spacing
DB_USER=mySecureDbUser
DB_PASSWORD=123
PORT=3000

````

````javascript
// *** src/index.js  <<< You only need to require mandatory env HERE
require('mandatoryenv').load([
    'DB_USER',
    'DB_PASSWORD',
    'PORT']);
// If a variable is not found it will throw an error
// If you dont want it to throw an error you can enable silent mode by passing a true as second parameter
require('mandatoryenv').load([
    'DB_USER',
    'DB_PASSWORD',
    'PORT'], true);

console.log(process.env);

````

````javascript
// *** src/server.js < It's not necessary to require it again as we already did on index.js so we just use values directly
const { PORT } = process.env; // or const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Serverl listening on port ${PORT}`));

````

````javascript
// *** src/model/database.js
const { DB_USER, DB_PASSWORD } = process.env;

mysql.createConnection({
    user: DB_USER,
    password: DB_PASSWORD
})
````