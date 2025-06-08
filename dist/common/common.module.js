"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
// src/common/common.module.ts
const axios_1 = require("@nestjs/axios");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const setup_1 = require("@sentry/nestjs/setup");
const common_controller_1 = require("./common.controller");
const common_service_1 = require("./common.service");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            setup_1.SentryModule.forRoot(),
            cache_manager_1.CacheModule.register(), // si no es global
        ],
        controllers: [common_controller_1.CommonController],
        providers: [
            common_service_1.CommonService,
            {
                provide: core_1.APP_FILTER,
                useClass: setup_1.SentryGlobalFilter,
            },
        ],
        exports: [common_service_1.CommonService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map