'use strict';

const {
  has
} = require('lodash');

const { 
  parseMultipartData,
  sanitizeEntity,
} = require('strapi-utils');

const {
  update
}  = require('strapi-plugin-users-permissions/controllers/user/admin');

const validateUploadBody = require('strapi-plugin-upload/controllers/validation/upload');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  update: async (ctx) => {
    const {
      state: { isAuthenticatedAdmin },
    } = ctx;

    if (isAuthenticatedAdmin) {
      return update(ctx);
    }
    
    let body = ctx.request.body;
    let files;
    if (ctx.is('multipart')) {
      const multipartData = parseMultipartData(ctx);
      body = multipartData.data;
      files = multipartData.files;
    }

    const advancedConfigs = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const { id } = ctx.params;
    const { email, username, password } = body;

    const user = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    });

    if (has(body, 'email') && !email) {
      return ctx.badRequest('email.notNull');
    }

    if (has(body, 'username') && !username) {
      return ctx.badRequest('username.notNull');
    }

    if (has(body, 'password') && !password && user.provider === 'local') {
      return ctx.badRequest('password.notNull');
    }

    if (has(body, 'username')) {
      const userWithSameUsername = await strapi
        .query('user', 'users-permissions')
        .findOne({ username });

      if (userWithSameUsername && userWithSameUsername.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.username.taken',
            message: 'username.alreadyTaken.',
            field: ['username'],
          })
        );
      }
    }

    if (has(body, 'email') && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query('user', 'users-permissions')
        .findOne({ email: email.toLowerCase() });

      if (userWithSameEmail && userWithSameEmail.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.taken',
            message: 'Email already taken',
            field: ['email'],
          })
        );
      }
      body.email = body.email.toLowerCase();
    }

    let updateData = {
      ...body,
    };

    if (has(body, 'password') && password === user.password) {
      delete updateData.password;
    }

    let uploads;
    
    if (files) {
      const uploadService = strapi.plugins.upload.services.upload;
      const uploadPromises = Object.keys(files).map(key => {
        let promise;
        const file = files[key];
        if (user[key] && user[key].id) {
          
          promise = uploadService.replace(user[key].id, {
            file,
            data: validateUploadBody(user[key]),
          }, user);
        } else {
          promise = uploadService.upload({
            data: {},
            files: [file],
          }, user); 
        }

        return promise;
      });
      
      uploads = await Promise.all(uploadPromises);
    }

    const uploadData = {};

    if (files && uploads) {
      Object.keys(files).forEach((key, index) => {
        if (uploads[index]) {
          Object.assign(uploadData, {
            [key]: uploads[index],
          });
        }
      });
    }
    
    const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, {
      ...updateData,
      ...uploadData,
    });
    
    ctx.send(sanitizeUser(data));
  },
};