"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const node_1 = __importDefault(require("@sentry/node"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./filters/http-exception.filter");
require("./instrument");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    node_1.default.init({
        dsn: process.env.SENTRY_DSN,
        sendDefaultPii: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Spoonacular Recetas API")
        .setDescription("API para recetas aleatorias desde Spoonacular")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map