// src/common/common.module.ts
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";

@Module({
  imports: [
    HttpModule,
    SentryModule.forRoot(),
    CacheModule.register(), // si no es global
  ],
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
