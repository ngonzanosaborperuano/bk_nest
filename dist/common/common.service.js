"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const config_keys_1 = require("./config/config-keys");
let CommonService = class CommonService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get(config_keys_1.CONFIG_KEYS.API_EXTERNA.URL);
        this.headers = {
            "x-rapidapi-host": this.configService.get(config_keys_1.CONFIG_KEYS.API_EXTERNA.HEADER),
            "x-rapidapi-key": this.configService.get(config_keys_1.CONFIG_KEYS.API_EXTERNA.KEY),
        };
    }
    async getRandomRecipe(tag, number = 1) {
        const url = `${this.baseUrl}/random`;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: this.headers,
                params: {
                    number,
                    tags: tag,
                },
            }));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to fetch recipe");
        }
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], CommonService);
//# sourceMappingURL=common.service.js.map