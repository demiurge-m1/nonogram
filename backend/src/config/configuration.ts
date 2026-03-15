export default () => ({
  port: parseInt(process.env.PORT ?? '3333', 10),
  host: process.env.HOST ?? '0.0.0.0',
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
});
