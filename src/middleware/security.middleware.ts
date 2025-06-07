import { Injectable, NestMiddleware } from '@nestjs/common';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    helmet()(req, res, () => {});
    cors()(req, res, () => {});
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })(req, res, next);
  }
}
