'use-strict';

const { sanitizeEntity } = require('strapi-utils');

const { getModel, getService } = require('./utils');

/**
 * 
 * @param {*} ctx 
 * @param {*} app 
 * @param {*} modelName 
 * @returns 
 */
const pager = async (ctx, app, modelName) => {
  const service = getService(app, modelName);
  const model = getModel(app, modelName);

  const { _start, _limit, ...query } = ctx.query;
  const start = Number(_start);
  const limit = Number(_limit);

  let entities;
  if (ctx.query._q) {
    entities = await service.search(ctx.query);
  } else {
    entities = await service.find(ctx.query);
  }
  
  const result =  entities.map(entity => sanitizeEntity(entity, {model}));
  const isPager = _start && _limit ? true : false;

  if (!isPager) {
    return result;
  }

  let count;

  if (isPager) {
    try {
      if (ctx.query._q) {
        count = await service.countSearch(query);
      }
      
      count = await service.count(query);
    } catch (error) {
      return ctx.badRequest(error);
    }
  }

  return {
    count,
    countValue: result.length,
    current: {
      _limit: limit,
      _start: start,
    },
    next: start + limit < count ? {
      _limit, 
      _start: start + limit,
    } : null,
    prev: start + limit > count ? {
      _limit,
      _start: start - limit < 0 ? 0 : start - limit,
    } : null,
    value: result,
  };
};

module.exports = pager;