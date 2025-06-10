export default () => ({
  apiExterna: {
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    RAPIDAPI_BASE_URL: process.env.RAPIDAPI_BASE_URL,
    HEADER_SPOONACULAR: process.env.HEADER_SPOONACULAR,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
});
