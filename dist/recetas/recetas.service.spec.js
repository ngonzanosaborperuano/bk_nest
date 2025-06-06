"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const recetas_service_1 = require("./recetas.service");
describe('RecetasService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [recetas_service_1.RecetasService],
        }).compile();
        service = module.get(recetas_service_1.RecetasService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
