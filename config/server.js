const isStaging = process.env.NODE_ENV === 'staging' ? true : false;

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', isStaging ? 1338 : 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '672945d63b44676fda6b268275a1cfdd'),
    },
  },
});
