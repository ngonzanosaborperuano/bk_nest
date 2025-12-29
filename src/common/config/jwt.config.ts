export default () => ({
  jwt: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES: process.env.JWT_EXPIRES
  },
});
