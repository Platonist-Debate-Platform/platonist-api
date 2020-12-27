'use strict';

const { 
  parseMultipartData,
  sanitizeEntity,
} = require('strapi-utils')

module.exports = {
  // delete: async (ctx) => {
  //   const model = strapi.query('user', 'users-permissions').model;
  //   const service = strapi.plugins['users-permissions'].services.user;

  // },
  update: async (ctx) => {
    const model = strapi.query('user', 'users-permissions').model;
    const service = strapi.plugins['users-permissions'].services.user;
    console.log(service);
    const { id } = ctx.params;

    let canUpdate = false;

    switch (ctx.state.user.role.type) {
      case 'admin':
      case 'moderator':
        canUpdate = true;
      default:
        break;
    }

    if (id !== ctx.state.user.id.toString() || !canUpdate) {
      return ctx.unauthorized(`You can't edit this entry`);
    }

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await service.edit({ id }, data, {
        files,
      });
    } else {
      entity = await service.edit({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model });
  }
};