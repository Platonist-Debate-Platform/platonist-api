'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */


module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      if (strapi.emitSocket && strapi.emitSocket.comment && strapi.emitSocket.comment.create) {
        strapi.emitSocket.comment.create(result);
      }
    },
    afterUpdate: async (result, params, data) => {
      if (strapi.emitSocket && strapi.emitSocket.comment.update) {
        strapi.emitSocket.comment.update(result);
      }
    },
    afterDelete: async(result, params) => {
      if (strapi.emitSocket && strapi.emitSocket.comment.delete) {
        strapi.emitSocket.comment.delete(result);
      }
    }
  }
};
