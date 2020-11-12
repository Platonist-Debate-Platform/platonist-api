'use strict';

const { 
  filterActiveItem,
  filterActiveItems,
} = require('../../../lib/filter-active');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find (ctx) {
    return await filterActiveItems({
      ctx,
      identity: this.identity,
      server: strapi,
    });
  },
  async findOne (ctx) {
    return await filterActiveItem({
      ctx,
      identity: this.identity,
      server: strapi,
    });
  },
};
