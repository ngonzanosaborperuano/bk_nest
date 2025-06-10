import { Global, Module } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";

@Global()
@Module({
  providers: [MonitoringService],
  exports: [],
})
export class MonitoringModule {}

/**
 
| Mejora           | Justificación                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `@Global()`      | Permite que este módulo se use en cualquier parte sin necesidad de `imports`.                   |

 */
