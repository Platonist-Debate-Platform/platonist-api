'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

const {
  getModel,
  getService,
} = require('../../../lib/utils');

const settings = require('../models/article.settings.json');

const modelName = settings.info.name;

module.exports = {
  fetchUrl: async (ctx) => {
    const service = getService(strapi, modelName.toLowerCase());
    const model = getModel(strapi, modelName.toLowerCase());
    const { 
      url 
    } = ctx.request.body;

    if (!url) {
      return ctx.badRequest(null, 'Url is missing');
    }
    
    let entity;
    try {
      entity = await service.fetchMetaData(url);
    } catch (error) {
      return ctx.badRequest(null, error);
    }

    return sanitizeEntity(entity, { model });
  },
};
