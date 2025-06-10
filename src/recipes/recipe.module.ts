// src/common/common.module.ts
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";

@Module({
  imports: [HttpModule], //, SentryModule.forRoot()
  controllers: [CommonController],
  providers: [
    CommonService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [CommonService],
})
export class CommonModule {}
