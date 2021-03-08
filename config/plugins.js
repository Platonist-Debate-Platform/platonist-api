module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'sslout.df.eu'),
      port: env('SMTP_PORT', 25),
      auth: {
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD'),
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: 'hello@platonist.de',
      defaultReplyTo: 'hello@platonist.de',
    },
  },
});
