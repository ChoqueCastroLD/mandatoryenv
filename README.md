## Mandatory Env

Find loads and verifies your enviroment variables wherever they are! (.env files for example)


https://www.npmjs.com/package/mandatoryenv


·Disclaimer: This module uses dotenv in the background, adding only extra checking for the variables it loads.

Example usage:
````javascript
// *** .env < Be careful with spacing
PORT=3000
DB_USER=mySecureDbUser
````

You only need to require mandatoryenv once in top of your main file

````javascript
// *** src/index.js  <<< 

// Mandatory variables

require('mandatoryenv')
.load(['DB_USER', 'DB_PASSWORD', 'PORT']);
// > Throws Error Missing Enviroment Variable DB_PASSWORD

require('mandatoryenv')
.load(['DB_USER', 'PORT']);
// process.env > {'DB_USER': 'mySecureDbUser', 'PORT': '3000'}
// env > {'DB_USER': 'mySecureDbUser', 'PORT': '3000'}

````

````javascript
// *** src/index.js  <<< 

// Optional variables

require('mandatoryenv')
.load({'DB_USER': 'test', 'DB_PASSWORD': '123', 'PORT': 4444});
// process.env > {'DB_USER': 'mySecureDbUser', 'DB_PASSWORD': '123', 'PORT': '3000'}
// env > {'DB_USER': 'mySecureDbUser', 'DB_PASSWORD': '123', 'PORT': '3000'}

// You can put class Error as value if you dont want to use a default value

require('mandatoryenv')
.load({'DB_USER': 'test', 'DB_PASSWORD': Error, 'DB_DATABASE': Error, 'PORT': Error});
// > Throws Error Missing Enviroment Variable DB_PASSWORD, DB_DATABASE

require('mandatoryenv')
.load({'DB_USER': 'test', 'DB_PASSWORD': '123', 'DB_DATABASE': Error, 'PORT': Error});
// > Throws Error Missing Enviroment Variable DB_DATABASE

require('mandatoryenv')
.load({'DB_USER': 'test', 'DB_PASSWORD': '123', 'DB_DATABASE': 'testdb', 'PORT': Error});
// process.env > {'DB_USER': 'mySecureDbUser', 'DB_PASSWORD': '123', 'DB_DATABASE': 'testdb', 'PORT': '3000'}
// env > {'DB_USER': 'mySecureDbUser', 'DB_PASSWORD': '123', 'DB_DATABASE': 'testdb', 'PORT': '3000'}
````

````javascript
// *** src/server.js 
require('mandatoryenv').load({'PORT': 3000});

app.listen(env.PORT, () => console.log(`Serverl listening on port ${env.PORT}`));
// or
app.listen(process.env.PORT, () => console.log(`Serverl listening on port ${process.env.PORT}`));
````