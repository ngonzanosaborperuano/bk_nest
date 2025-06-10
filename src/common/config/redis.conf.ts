export default () => ({
  redis: {
    HOST: process.env.REDIS_HOST,
    PORT: parseInt(process.env.REDIS_PORT ?? "6379", 10),
    PASSWORD: process.env.REDIS_PASSWORD,
  },
});
