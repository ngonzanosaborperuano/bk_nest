export default () => ({
  database: {
    DB_HOST: process.env.POSTGRES_HOST,
    DB_PORT: parseInt(process.env.POSTGRES_PORT ?? "5433", 10),
    DB_USER: process.env.POSTGRES_USER,
    DB_PASS: process.env.POSTGRES_PASSWORD,
    DB_NAME: process.env.POSTGRES_DB,
  },
});
