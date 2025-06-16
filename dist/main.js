"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const reflector = app.get(core_1.Reflector);
    // Seguridad y configuración general
    app.use((0, helmet_1.default)());
    app.enableCors(); // Personaliza si es necesario
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
    if (process.env.NODE_ENV !== "production") {
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    }
    // Swagger
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("Spoonacular Recetas API Nest")
        .setDescription("API para recetas aleatorias desde Spoonacular")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        name: 'Authorization',
        description: 'JWT Authorization header using the Bearer scheme',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map