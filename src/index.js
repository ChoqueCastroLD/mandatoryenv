const fs = require('fs');
const path = require('path');

function parseEnv(content) {
    let temp = {};
    const env = content.split('\n')
                        .filter(v => !v.startsWith('#'))
                        .filter(v => !v.startsWith('//'));
    for (const line of env) {
        let key = line.substring(0, line.indexOf('='));
        let value = line.substring(line.indexOf('=') + 1);
        temp[key] = value;
    }
    return temp;
}

function loadEnvByName(filename) {
    const content = fs.readFileSync(path.join(process.cwd(), filename)).toString();
    return parseEnv(content);
}

function envValidation(_env, _load) {
    let notFound = [];
    let defaultValues = [];
    let useDefaults = !Array.isArray(_load);

    if (useDefaults) {
        defaultValues = Object.values(_load);
        _load = Object.keys(_load);
    }

    // Check if all needed enviroment variables are available
    for (const i in _load) {
        if (_load.hasOwnProperty(i)) {
            const element = _load[i];
            if (!Reflect.has(_env, element)) {
                if (useDefaults && defaultValues[i]['name'] !== 'Error') {
                    _env[element] = defaultValues[i]
                } else {
                    notFound.push(element)
                }
            }
        }
    }

    if (notFound.length !== 0) {
        let errMessage = `  ❌   Missing Enviroment Variables \n`;
        for (const i in notFound) {
            if (notFound.hasOwnProperty(i)) {
                errMessage += `\n\t❌\t${notFound[i]}\n`;
            }
        }
        throw errMessage;
    }

    return _env;
}

module.exports = {
    load(enviroments = {
        global: {
            load_if: () => true,
            load_from: '.env',
            load: []
        }
    }, config = {
        load_only: null || '',
        load_from: null || ''
    }) {
        for (const enviroment in enviroments) {
            if (config.load_only || config.load_from) {
                if (!config.load_only || !config.load_from) {
                    let errMessage = `  ❌   load_only and load_from must be used both or none \n`;
                    throw errMessage;
                }
            }
            if (config.load_only) {
                if (enviroment === config.load_only) {
                    let _env = loadEnvByName('.env');
                    if (!enviroments[enviroment].load) {
                        let errMessage = `  ❌   Enviroment ${enviroment} must have a load property \n`;
                        throw errMessage;
                    }
                    const finalEnv = {
                        ...envValidation(_env, enviroments[enviroment].load),
                        ...process.env
                    }
                    process.env = finalEnv;
                    global.env = finalEnv;
                    return finalEnv;
                }
            }

            if (enviroments.hasOwnProperty(enviroment)) {
                const curenv = enviroments[enviroment];
                if (curenv.load_if) {
                    let _env = loadEnvByName(curenv.load_from);

                    if (curenv.load_if(process.env) === true) {
                        if (!curenv.load_from) {
                            let errMessage = `  ❌   Enviroment ${enviroment} must have a load_from property \n`;
                            throw errMessage;
                        }
                        if (curenv.load_includes) {
                            if (!Array.isArray(curenv.load_includes)) {
                                let errMessage = `  ❌   Enviroment ${enviroment}, load_includes must be an Array of Strings \n`;
                                throw errMessage;
                            }
                            for (const envname in curenv.load_includes) {
                                if (curenv.load_includes.hasOwnProperty(envname)) {
                                    const element = curenv.load_includes[envname];
                                    if (!enviroments[element].load) {
                                        let errMessage = `  ❌   Enviroment ${enviroment}, included Enviroment '${element}' must have a load property \n`;
                                        throw errMessage;
                                    }
                                    _env = {
                                        ..._env,
                                        ...envValidation(_env, enviroments[element].load)
                                    }
                                }
                            }
                        }
                        _env = {
                            ..._env,
                            ...envValidation(_env, curenv.load)
                        }

                        const finalEnv = {
                            ..._env,
                            ...process.env,
                        }

                        process.env = finalEnv;
                        global.env = finalEnv;

                        return finalEnv;
                    }
                }

            }
        }

        global.env = process.env;
        return process.env;
    }
}