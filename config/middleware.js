module.exports = () => ({
  settings: {
    cors: {
      enabled: true,
      credentials: true,
      origin: ['http://localhost:3000', 'http://localhost:1337'],
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "access-control-allow-origin"
      ]
    },
  },
});