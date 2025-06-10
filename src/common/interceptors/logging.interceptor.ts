import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, catchError, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const { method, url, body, ip } = req;
    const user = (req as any).user?.email || "Anonymous"; // Si usas Passport

    const now = Date.now();
    this.logger.log(
      `➡️  ${method} ${url} | Body: ${JSON.stringify(
        body
      )} | IP: ${ip} | User: ${user}`
    );

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        const statusCode = res.statusCode;
        this.logger.log(`✅ ${method} ${url} ${statusCode} - ${delay}ms`);
      }),
      catchError((err) => {
        const delay = Date.now() - now;
        const statusCode = res.statusCode;
        this.logger.error(
          `❌ ${method} ${url} ${statusCode} - ${delay}ms - Error: ${err.message}`
        );
        throw err;
      })
    );
  }
}
