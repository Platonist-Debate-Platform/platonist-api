module.exports = () => ({
  settings: {
    cors: {
      enabled: true,
      credentials: true,
      origin: ['https://staging.platonist.de', 'https://staging-api.platonist.de'],
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "access-control-allow-origin"
      ]
    },
  },
});