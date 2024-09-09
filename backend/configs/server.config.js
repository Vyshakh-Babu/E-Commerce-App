// A configs folder and a server.config.js file are ways to organize and store configuration files in a Node.js project. 
// Configuration files are files that contain settings and options for your application, such as database credentials, API keys, ports, etc. 
// Configuration files can help you manage different environments, such as development, testing, and production, by using different values for each environment.

if(process.env.NODE_ENV != 'production') {
    require('dotenv').config(); //config method reads the .env file and assigns the variables to the process.env object
}


module.exports = {
    PORT: process.env.PORT//PORT property is set to the value of the environment variable PORT. core module
}

/*This server.config.js code is a configuration file that exports an object with a PORT property. 
The PORT property is set to the value of the environment variable PORT, which is defined in the .env file. 
The .env file is a file that contains key-value pairs of environment variables, such as PORT=8080.
The first line of the server.config.js code checks if the process.env.NODE_ENV is not equal to 'production'. 
This means that the code is running in a development or testing environment, not in a production environment. 
If this condition is true, then the code requires and configures the dotenv package. 
The dotenv package is a package that loads the environment variables from the .env file into the process.env object, which can be accessed in the code.
The purpose of this code is to use different values for the PORT property depending on the environment. 
For example, in a development environment, the PORT property will be 8080, as defined in the .env file. 
But in a production environment, the PORT property will be whatever value is set by the hosting service or platform, such as Heroku or AWS. 
This way, the code can adapt to different environments without hard-coding the values.
*/

// This is where the dotenv package is imported and configured. 
// The require function loads the module and returns an object with a config method. 
// The config method reads the .env file and assigns the variables to the process.env object.