# Mandatory Env

Find, loads and verifies your enviroment variables wherever they are! (.env files for example)

https://www.npmjs.com/package/mandatoryenv

## Basic Usage Example:

````javascript
// *** .env <<< Be careful with spacing
PORT=3000
DB_USER=mySecureDbUser
````

You only need to require mandatoryenv once in top of your main file then you can access global variable env anywhere in your code

````javascript
// *** src/index.js <<< 

// Load All variables from .env
require('mandatoryenv').load();

process.env.PORT
// > 3000
process.env.DB_USER
// > mySecureDbUser

// *** src/index.js <<< 

// Load all variables from .env and assign them to global env variable
require('mandatoryenv').load(['PORT', 'DB_USER'], {defineGlobal: true});
// Variables in array are mandatory (an error will be thrown if not found)

env.PORT
// > 3000
env.DB_USER
// > mySecureDbUser
````

## Advanced Usage Example (Using env.config.js):

````javascript
// *** .env <<< Be careful with spacing
PORT=3000
DB_USER=mySecureDbUser
DB_PASSWORD=123456
````

````javascript
// *** env.config.js
module.exports = {
    global: {
        load_if: () => true, // Always use this enviroment config
        load_from: '.env',
        load: {
            'PORT': 3000,
            'DB_USER': 'root',
            'DB_PASSWORD': Error, // If not set an error will be thrown
        },
    }
}
````

````javascript
// *** index.js
require('mandatoryenv').loadConfig(require('./env.config.js'), {defineGlobal: true});

env.PORT
// > 3000
env.DB_USER
// > mySecureDbUser
env.DB_PASSWORD
// > 123456
````

## More Advanced Usage Example (Using env.config.js):

````javascript
// *** .env <<< Be careful with spacing
PORT=3000
DB_USER=mySecureDbUser
DB_PASSWORD=123456
````

````javascript
// *** env.config.js
module.exports = {
    database: {
        load: [
            'DB_USER',
            'DB_PASSWORD'
        ]
    },
    developmentEnviroment: {
        load_if: (env) => env.NODE_ENV.toUpperCase() == 'DEVELOPMENT', // Load if dev env
        load_includes: ['database']
        load_from: '.env.dev',
        load: {
            'PORT': 3000 // If not set default value will be 3000
        },
    },
    productionEnviroment: {
        load_if: (env) => env.NODE_ENV.toUpperCase() == 'PRODUCTION', // Load if prod env
        load_from: '.env',
        load: {
            'PORT': Error // If not set an error will be thrown
        },
    }
}
````

````javascript
// *** index.js
require('mandatoryenv').loadConfig(require('./env.config.js'));

env.PORT
// > 3000
env.DB_USER
// > mySecureDbUser
env.DB_PASSWORD
// > 123456
````