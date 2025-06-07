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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecetasController = void 0;
const common_1 = require("@nestjs/common");
const recetas_service_1 = require("./recetas.service");
const create_receta_dto_1 = require("./dto/create-receta.dto");
const update_receta_dto_1 = require("./dto/update-receta.dto");
let RecetasController = class RecetasController {
    constructor(recetasService) {
        this.recetasService = recetasService;
    }
    create(createRecetaDto) {
        return this.recetasService.create(createRecetaDto);
    }
    findAll() {
        return this.recetasService.findAll();
    }
    findOne(id) {
        return this.recetasService.findOne(+id);
    }
    update(id, updateRecetaDto) {
        return this.recetasService.update(+id, updateRecetaDto);
    }
    remove(id) {
        return this.recetasService.remove(+id);
    }
};
exports.RecetasController = RecetasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_receta_dto_1.CreateRecetaDto !== "undefined" && create_receta_dto_1.CreateRecetaDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], RecetasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecetasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecetasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_receta_dto_1.UpdateRecetaDto !== "undefined" && update_receta_dto_1.UpdateRecetaDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], RecetasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecetasController.prototype, "remove", null);
exports.RecetasController = RecetasController = __decorate([
    (0, common_1.Controller)('recetas'),
    __metadata("design:paramtypes", [recetas_service_1.RecetasService])
], RecetasController);
