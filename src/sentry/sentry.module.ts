import { Global, Module } from "@nestjs/common";
import { SentryService } from "./sentry.service";

@Global()
@Module({
  providers: [SentryService],
  exports: [],
})
export class SentryModule {}

/**
 
| Mejora           | Justificación                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `@Global()`      | Permite que este módulo se use en cualquier parte sin necesidad de `imports`.                   |

 */
