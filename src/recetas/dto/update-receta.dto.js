"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRecetaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_receta_dto_1 = require("./create-receta.dto");
class UpdateRecetaDto extends (0, mapped_types_1.PartialType)(create_receta_dto_1.CreateRecetaDto) {
}
exports.UpdateRecetaDto = UpdateRecetaDto;
