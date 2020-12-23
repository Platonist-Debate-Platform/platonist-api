'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async findByTitle (ctx) {
    const { title } = ctx.params;
    const entity = await strapi.services.debate.findOne({ title });
    return sanitizeEntity(entity, { model: strapi.models.debate });
  },
  async findComments (ctx) {
    const {
      id
    } = ctx.params;
    console.dir(Object.keys(ctx))
    console.dir(ctx.matched)
    const entity = await strapi.services.comment.findOne({
      debate: id
    });

    return sanitizeEntity(entity, { model: strapi.models.comment });
  }
};
