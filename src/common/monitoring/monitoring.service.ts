import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/node";
import { CONFIG_KEYS } from "../config/config-keys";

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const dsn = this.configService.get<string>(
      CONFIG_KEYS.API_EXTERNA.SENTRY_DNS
    );
    Sentry.init({
      dsn,
      sendDefaultPii: true,
    });
  }
}
/**
 
| Mejora           | Justificación                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `onModuleInit()` | Ejecutas lógica después de que Nest ha resuelto todas las dependencias.                         |
| `MonitoringService`  | Encapsulas mejor la lógica de inicialización, respetando SRP (Single Responsibility Principle). |

 */
