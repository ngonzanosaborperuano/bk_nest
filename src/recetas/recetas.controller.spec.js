"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const recetas_controller_1 = require("./recetas.controller");
const recetas_service_1 = require("./recetas.service");
describe('RecetasController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [recetas_controller_1.RecetasController],
            providers: [recetas_service_1.RecetasService],
        }).compile();
        controller = module.get(recetas_controller_1.RecetasController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
