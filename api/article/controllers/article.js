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

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

const settings = require('../models/article.settings.json');

const modelName = settings.info.name;

module.exports = {
  fetchUrl: async (ctx) => {
    const service = getService(strapi, modelName.toLowerCase());
    const model = getModel(strapi, modelName.toLowerCase());
    const { 
      key, 
      url,
    } = ctx.request.body;

    if (!url) {
      return ctx.badRequest(
        null, 
        formatError({
          id: 'Article.form.error.url.missing',
          message: 'The "URL" entity is required',
        })
      ); 
    }

    if (!key) {
      return ctx.badRequest(
        null, 
        formatError({
          id: 'Article.form.error.key.missing',
          message: 'The "key" entity is required',
        })
      ); 

    }
    
    let entity;
    try {
      entity = await service.fetchMetaData(url);
    } catch (error) {
      return ctx.badRequest(null, error);
    }

    const sanitizedEntity = sanitizeEntity(entity, { model });

    return {
      ...sanitizedEntity,
      key,
    };
  },
};
