// src/reports/reports.module.ts
import { Module } from "@nestjs/common";
import { KnexProvider } from "./knex.provider";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  providers: [ReportsService, KnexProvider],
  exports: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
