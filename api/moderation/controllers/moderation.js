'use strict';

const { 
  sanitizeEntity,
} = require('strapi-utils');

const {
  getModel,
  getService,
} = require('../../../lib/utils');

const settings = require('../models/moderation.settings.json');

const modelName = settings.info.name;

module.exports = {
  byCommentId: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);
    const { comment } = ctx.params;
    
    const entity = await service.findOne({comment});
    return sanitizeEntity(entity, {model});
  },
};
