export const CONFIG_KEYS = {
  DB: {
    HOST: "database.DB_HOST",
    PORT: "database.DB_PORT",
    USER: "database.DB_USER",
    PASS: "database.DB_PASS",
    NAME: "database.DB_NAME",
  },
  API_EXTERNA: {
    KEY: "apiExterna.RAPIDAPI_KEY",
    URL: "apiExterna.RAPIDAPI_BASE_URL",
    HEADER: "apiExterna.HEADER_SPOONACULAR",
    SENTRY_DNS: "apiExterna.SENTRY_DSN",
  },
  APP: {
    PORT: "app.PORT",
    HOST: "app.HOST",
    NODE_ENV: "app.NODE_ENV",
  },
  REDIS: {
    HOST: "redis.HOST",
    PORT: "redis.PORT",
    PASSWORD: "redis.PASSWORD",
  },
  JWT: {
    SECRET: "jwt.SECRET",
    EXPIRES: "jwt.EXPIRES",
    ALGORITHM: "jwt.ALGORITHM",
  },
};
