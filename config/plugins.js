module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'sslout.df.eu'),
      port: env('SMTP_PORT', 25),
      auth: {
        user: env('SMTP_USERNAME', 'info@daniel-pfisterer.de'),
        pass: env('SMTP_PASSWORD', 'Qwer1234'),
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: 'hello@platonist.de',
      defaultReplyTo: 'hello@platonist.de',
    },
  },
});
