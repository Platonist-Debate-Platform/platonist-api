'use strict';

const {
  sanitizeEntity,
} = require('strapi-utils');

module.exports = {
  lifecycles: {
    afterCreate: async (result) => {
      if (strapi.emitSocket && strapi.emitSocket.comment && strapi.emitSocket.comment.create) {
        let comment = await strapi.services.comment.findOne({ id: result.comment.id });
        comment = await strapi.services.comment.update({id: comment.id}, comment);
        strapi.emitSocket.comment.create(sanitizeEntity(comment, {model: strapi.models.comment}));
      }
    },
    afterUpdate: async (result) => {
      if (strapi.emitSocket && strapi.emitSocket.comment.update) {
        let comment = await strapi.services.comment.findOne({ id: result.comment.id });
        // comment = await strapi.services.comment.update({id: comment.id}, comment);
        comment.updated_at = new Date().toISOString();
        strapi.emitSocket.comment.create(sanitizeEntity(comment, {model: strapi.models.comment}));
      }
    },
    afterDelete: async(result) => {
      if (strapi.emitSocket && strapi.emitSocket.comment.delete) {
        let comment = await strapi.services.comment.findOne({ id: result.comment.id });
        comment = await strapi.services.comment.update({id: comment.id}, comment);
        strapi.emitSocket.comment.create(sanitizeEntity(comment, {model: strapi.models.comment}));
      }
    }
  }
};
