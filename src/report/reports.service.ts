import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX } from "./knex.provider";

@Injectable()
export class ReportsService {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  async obtenerUsuariosConRol(rol: string) {
    const result = await this.knex.raw(
      `SELECT * FROM obtener_usuarios_con_rol(?)`,
      [rol]
    );
    return result.rows;
  }
}
