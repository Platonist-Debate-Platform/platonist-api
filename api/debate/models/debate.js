'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate: async (result, /* data */) => {
      if (strapi.emitSocket && strapi.emitSocket.debate && strapi.emitSocket.debate.create) {
        strapi.emitSocket.debate.create(result);
      }
    },
    afterUpdate: async (result, /* params, data */) => {
      if (strapi.emitSocket && strapi.emitSocket.debate.update) {
        strapi.emitSocket.debate.update(result);
      }
    },
    afterDelete: async(result, /* params*/ ) => {
      if (strapi.emitSocket && strapi.emitSocket.debate.delete) {
        strapi.emitSocket.debate.delete(result);
      }
    }
  }
};
