'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity, parseMultipartData } = require('strapi-utils');

const { getModel, getService } = require('../../../lib/utils');

const settings = require('../models/debate.settings.json');
const articleSetting = require('../../article/models/article.settings.json');
const pager = require('../../../lib/pager');

const modelName = settings.info.name.toLowerCase();
const articleModelName = articleSetting.info.name.toLowerCase();

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  create: async (ctx) => {
    const service = getService(strapi, modelName);
    const articleService = getService(strapi, articleModelName);
    const model = getModel(strapi, modelName);
    const articleModel = getModel(strapi, articleModelName);
    let entity;

    if (ctx.request.body && ctx.request.body.articleA) {
      let articleA;
      try {
        articleA = await articleService.create(ctx.request.body.articleA);
      } catch (error) {
        ctx.badRequest(formatError(error));
      }

      ctx.request.body.articleA = sanitizeEntity(articleA, {
        model: articleModel,
      });
    }

    if (ctx.request.body && ctx.request.body.articleB) {
      let articleB;
      try {
        articleB = await articleService.create(ctx.request.body.articleB);
      } catch (error) {
        ctx.badRequest(error);
      }

      ctx.request.body.articleB = sanitizeEntity(articleB, {
        model: articleModel,
      });
    }

    const count = await service.count({ title: ctx.request.body.title });

    if (count > 0) {
      return ctx.badRequest(`Title "${ctx.request.body.title}"  already taken, please choose another!`);
    }

    try {
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);  
        entity = await service.create(data, { files });
      } else {
        entity = await service.create(ctx.request.body);
      }
    } catch (error) {
      return ctx.badRequest(formatError(error));
    }

    return sanitizeEntity(entity, { model });
  },

  findByTitle: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);
    const { title } = ctx.params;
    const entity = await service.findOne({ title });
    return sanitizeEntity(entity, { model });
  },

  findComments: async (ctx) => {
    const { id } = ctx.params;
    const entity = await strapi.services.comment.findOne({
      debate: id,
    });

    return sanitizeEntity(entity, { model: strapi.models.comment });
  },

  update: async (ctx) => {
    const service = getService(strapi, modelName);
    const articleService = getService(strapi, articleModelName);
    const model = getModel(strapi, modelName);
    const articleModel = getModel(strapi, articleModelName);

    const { id } = ctx.params;
    const { body } = ctx.request;

    let entity;
    try {
      entity = await service.findOne({ id });
    } catch (error) {
      return ctx.badRequest(formatError(error));
    }

    if (!entity) {
      return ctx.badRequest(`Debate with "${id}" doesn't exist`);
    }

    let articleA;
    try {
      const oldArticleA = await articleService.findOne({ id: entity.articleA.id });
      articleA = await articleService.update({ id: entity.articleA.id }, {
        ...oldArticleA,
        ...body.articleA,
      });
    } catch (error) {
      return ctx.badRequest(formatError(error));
    }

    if (body.articleA) {
      delete body.articleA;
    }

    let articleB;
    try {
      const oldArticleB = await articleService.findOne({ id: entity.articleB.id });
      articleB = await articleService.update({ id: entity.articleB.id }, {
        ...oldArticleB,
        ...body.articleB,
      });
    } catch (error) {
      return ctx.badRequest(formatError(error));
    }

    if (body.articleB) {
      delete body.articleB;
    }

    ctx.request.body = body;

    let debate;
    try {
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        debate = await service.update({ id }, data, {
          files,
        });
      } else {
        debate = await service.update({ id }, body);
      }
    } catch (error) {
      return ctx.badRequest(formatError(error));
    }

    debate.articleA = sanitizeEntity(articleA, {
      model: articleModel,
    });

    debate.articleB = sanitizeEntity(articleB, {
      model: articleModel,
    });

    return sanitizeEntity(debate, {
      model
    });
  },

  /**
   * 
   * @param {*} ctx 
   */
  find: async (ctx) => {
    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(ctx.query, {
            archiveDate_gte: new Date().getTime(),
            published: true
          });
          break;
      }
    } else {
      Object.assign(ctx.query, {
        archiveDate_gte: new Date().getTime(),
        published: true
      });
    }

    return pager(ctx, strapi, modelName);
  },

  /**
   * 
   * @param {*} ctx 
   */
  findOne: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;

    const params = {
      id,
    };

    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(params, {
            archiveDate_gte: new Date().getTime(),
            published: true
          });
          break;
      }
    } else {
      Object.assign(params, {
        archiveDate_gte: new Date().getTime(),
        published: true
      });
    }

    const entity = await service.findOne(params);

    return sanitizeEntity(entity, {model});
  },
  count: async (ctx) => {
    const service = getService(strapi, modelName);
    
    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(ctx.query, {
            archiveDate_gte: new Date().getTime(),
            published: true
          });
          break;
      }
    } else {
      Object.assign(ctx.query, {
        archiveDate_gte: new Date().getTime(),
        published: true
      });
    }

    if (ctx.query._q) {
      return service.countSearch(ctx.query);
    }
    
    return service.count(ctx.query);
  }
};
