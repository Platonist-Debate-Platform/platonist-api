'use strict';

const { 
  parseMultipartData,
  sanitizeEntity,
} = require('strapi-utils')

const {
  getModel,
  getService,
} = require('../../../lib/utils');

const settings = require('../models/comment.settings.json');

const modelName = settings.info.name;

const countReplies = result => {
  if (!result || result && !result.replies) {
    return 0;
  }

  return result.replies.length;
};

const cleanEntity = entity => {
  entity.meta = {
    debateId: (entity.debate && entity.debate.id) || null,
    moderatorId: (entity.moderator && entity.moderator.id) || null,
    userId: (entity.user && entity.user.id) || null, 
  };

  entity.replyCount = countReplies(entity);

  delete entity.debate;
  delete entity.moderator;
  
  return entity;
};

const cleanAndSanitizeEntity = (entity, model) => {
  const sanitizedEntity = sanitizeEntity(entity, { 
    model
  });

  return cleanEntity(sanitizedEntity);
};

module.exports = {

  /**
   * 
   * @param {*} ctx 
   */
  create: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await service.create(data, { files });
    } else {
      entity = await service.create(ctx.request.body);
    }

    return cleanAndSanitizeEntity(entity, model);
  },

  /**
   * 
   * @param {*} ctx 
   */
  delete: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;

    const [comment] = await service.find({
      id,
      'user.id': ctx.state.user.role,
    });
    
    let canDelete = false;
    switch (ctx.state.user.role.type) {
      case 'admin':
      case 'moderator':
        canDelete = true;
      default:
        break;
    }

    if (!comment || !canDelete) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    const entity = await service.delete({ id });

    if (!entity) {
      return null;
    } 

    return cleanAndSanitizeEntity(entity, model);
  },

  /**
   * 
   * @param {*} ctx 
   */
  find: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    let entities;
    if (ctx.query._q) {
      entities = await service.search(ctx.query);
    } else {
      entities = await service.find(ctx.query);
    }

    return entities.map(entity => cleanAndSanitizeEntity(entity, model));
  },

  /**
   * 
   * @param {*} ctx 
   */
  findByUser: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);
    
    const {
      userId
    } = ctx.params;
    
    const query = {
      ...ctx.query,
      user: userId,
    };

    let entities;

    if (query._q) {
      entities = await service.search(query);
    } else {
      entities = await service.find(query);
    }

    return entities.map(entity => cleanAndSanitizeEntity(entity, model));
  },

  /**
   * 
   * @param {*} ctx 
   */
  findOne: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;

    const entity = await service.findOne({ id });

    if (!entity) {
      return null;
    } 

    return cleanAndSanitizeEntity(entity, model);
  },

  update: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;
    
    const [comment] = await service.find({
      id,
      'user.id': ctx.state.user.id,
    });

    if (!comment) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await service.update({ id }, data, {
        files,
      });
    } else {
      entity = await service.update({ id }, ctx.request.body);
    }

    return cleanAndSanitizeEntity(entity, model);
  },
};
