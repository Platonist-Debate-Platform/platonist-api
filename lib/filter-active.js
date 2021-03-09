'use-strict';

const { sanitizeEntity } = require('strapi-utils');

const filterActiveEntity = (entity, model) =>  {
  if (!model || (model && !model.attributes) || (model && model.attributes && !model.attributes.active)) {
    return entity;
  }
  if (!('active' in entity) || !entity.active) {
    return null;
  }

  return entity;
};

const useMethods = ({
  server,
  identity,
}) => {

  const key = identity.toLowerCase();

  return {
    model: server && server.models && server.models[key],
    service: server && server.services && server.services[key],
  };
};

const filterActiveItems = async ({
  server,
  ctx,
  identity,
}) => {

  const {
    model, 
    service 
  } = useMethods({
    identity,
    server,
  });

  if (!model || !service) {
    return null;
  }

  let entities;

  if (ctx.query._q) {
    entities = await service.search(ctx.query);
  } else {
    entities = await service.find(ctx.query);
  }

  return entities
    .filter(entity => filterActiveEntity(entity, model))
    .map(entity => sanitizeEntity(entity, { model }));
};

const filterActiveItem = async ({
  server,
  ctx,
  identity,
}) => {

  const {
    model, 
    service 
  } = useMethods({
    identity,
    server,
  });

  if (!model || !service) {
    return null;
  }

  const { id } = ctx.params;
  let entity = await service.findOne({ id });

  entity = entity && filterActiveEntity(entity, model);

  if (!entity) {
    return null;
  }

  return sanitizeEntity(entity, { model });
};

module.exports = {
  filterActiveItem,
  filterActiveItems,
};