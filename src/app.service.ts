import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'ok',
      message: 'Bienvenido al API de Recetas!',
      timestamp: new Date().toISOString(),
    };
  }
} 