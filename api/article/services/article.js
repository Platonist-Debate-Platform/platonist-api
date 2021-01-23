'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const {getMetadata} = require('page-metadata-parser');
const domino = require('domino');
const axios = require('axios');


module.exports = {
  /**
   * meta-data-fetcher.js service
   *
   * @description: A set of functions similar to controller's actions to avoid code duplication.
   */
  fetchMetaData: async (url) => {
    const { data } = await axios.get(url);
    return getMetadata(domino.createWindow(data).document, url);
  },
};
