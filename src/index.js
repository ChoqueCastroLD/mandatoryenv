module.exports = {
    /**
     *  Load all your enviroment variables, pass an array for the ones that are mandatory
     * 
     * @param {Array<string>} variables default: [], An array of strings containting the enviroment variable names you need
     * @param {boolean} DotenvConfigOptions default: {}, dotenv configuration object
     */
    load(variables = [] || {}, DotenvConfigOptions = {}) {
        // Loads .env variables to proccess.env
        require('dotenv').config(DotenvConfigOptions);
    
        let notFound = [];
        let defaultValues = [];
        
        let useDefaults = !Array.isArray(variables);
        
        if (useDefaults) {
            defaultValues = Object.values(variables);
            variables = Object.keys(variables);
        }
        
        // Check if all needed enviroment variables are available
        
        for (const i in variables) {
            if (variables.hasOwnProperty(i)) {
                const element = variables[i];
                if ( !Reflect.has(process.env, element) ){
                    if(useDefaults && defaultValues[i]['name'] !== 'Error') {
                        process.env['element'] = defaultValues[i]
                    } else {
                        notFound.push(element)
                    }
                }
            }
        }
        
        if(notFound.length !== 0) {
            let errMessage = `  ❌   Missing Enviroment Variables \n`;
            for (const i in variables) {
                if (variables.hasOwnProperty(i)) {
                    const element = variables[i];
                    const symbol = notFound.indexOf(element) !== -1 ? '❌' : '✅';
                    const value = (defaultValues[i] || process.env[element] || '') ? '='+(defaultValues[i] || process.env[element] || '') : (defaultValues[i] || process.env[element] || '');
                    errMessage += `\n\t${symbol}  ${element}${value}\n`
                }
            }
            throw errMessage;
        }
        
        global.env = process.env;
        return process.env;
    }
}