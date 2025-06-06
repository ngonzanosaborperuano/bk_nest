import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  getHello(): string {
    return 'Common Service OK!';
  }
}
