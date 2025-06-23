export default () => ({
  app: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT ?? "3000", 10),
    HOST: process.env.HOST,
  },
});
