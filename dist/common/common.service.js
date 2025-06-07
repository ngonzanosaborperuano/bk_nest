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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CommonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const axios_1 = require("@nestjs/axios");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let CommonService = CommonService_1 = class CommonService {
    constructor(httpService, configService, cacheManager) {
        this.httpService = httpService;
        this.configService = configService;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(CommonService_1.name);
        this.baseUrl = 'https://api.spoonacular.com/recipes';
    }
    /**
     * Fetch random recipes from Spoonacular API with optional caching
     * @param tag The tag/category (e.g. 'dessert')
     * @param number Number of recipes
     * @returns Recipe data
     */
    async getRandomRecipe(tag, number = 1) {
        const cacheKey = `random_recipe:${tag}:${number}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            this.logger.log(`Returning cached recipe for: ${tag}`);
            return cached;
        }
        try {
            const apiKey = this.configService.get('SPOONACULAR_API_KEY');
            const url = `${this.baseUrl}/random`;
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                params: {
                    number,
                    tags: tag,
                    apiKey,
                },
            }));
            await this.cacheManager.set(cacheKey, data, 60 * 5); // cache por 5 minutos
            return data;
        }
        catch (error) {
            this.logger.error('Error fetching recipe', error);
            throw new common_1.InternalServerErrorException('Failed to fetch recipe');
        }
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = CommonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService, Object])
], CommonService);
