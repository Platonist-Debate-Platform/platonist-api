'use strict';

const {getMetadata} = require('page-metadata-parser');
const domino = require('domino');
const axios = require('axios');

/**
 * meta-data-fetcher.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  fetch: async (url) => {
    const { data } = await axios.get(url);
    console.log(data)
    return getMetadata(domino.createWindow(data).document, url);
  },
};
