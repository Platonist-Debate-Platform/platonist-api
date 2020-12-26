const pkgJson = require('./package.json');

module.exports = {
  apps : [
    {
      name: pkgJson.name,
      script      : "./server.js",
      watch       : true,
      env: {
        "NODE_ENV": "development",
      },
      env_production : {
         "NODE_ENV": "production"
      }
    },
  ],
};
