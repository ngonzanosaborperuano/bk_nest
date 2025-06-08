// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: "https://d60152359f1179b0ded1164517ffe97a@o4509459901251584.ingest.us.sentry.io/4509459903414272",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
