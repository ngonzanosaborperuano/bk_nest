import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags("Reportes")
@Controller("reportes")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @ApiBearerAuth()
  @ApiResponse({ status: 500, description: "Internal server error" })
  @Get("usuarios/:rol")
  @ApiParam({ name: "rol", type: String, example: "cliente" })
  obtenerUsuariosPorRol(@Param("rol") rol: string) {
    return this.reportsService.obtenerUsuariosConRol(rol);
  }
}
