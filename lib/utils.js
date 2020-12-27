'use strict';

module.exports = {
  getModel: (app, name) => app.models[name],
  getService: (app, name) => app.services[name],
};