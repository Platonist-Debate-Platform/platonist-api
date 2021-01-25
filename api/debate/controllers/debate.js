"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity, parseMultipartData } = require("strapi-utils");

const { getModel, getService } = require("../../../lib/utils");

const settings = require("../models/debate.settings.json");
const articleSetting = require("../../article/models/article.settings.json");

const modelName = settings.info.name.toLowerCase();
const articleModelName = articleSetting.info.name.toLowerCase();

module.exports = {
  async create(ctx) {
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
        ctx.badRequest(error);
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

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await service.create(data, { files });
    } else {
      entity = await service.create(ctx.request.body);
    }

    return sanitizeEntity(entity, { model });
  },

  async findByTitle(ctx) {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);
    const { title } = ctx.params;
    const entity = await service.findOne({ title });
    return sanitizeEntity(entity, { model });
  },

  async findComments(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.comment.findOne({
      debate: id,
    });

    return sanitizeEntity(entity, { model: strapi.models.comment });
  },
};
