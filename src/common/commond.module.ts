// import { Global, Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ThrottlerModule } from '@nestjs/throttler';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { RedisModule } from './cache/redis.module';
// import { SentryModule } from './monitoring/sentry.module';
// import { AuthService } from './auth/services/auth.service';
// import { JwtStrategy } from './auth/strategies/jwt.strategy';
// import { HashService } from './utils/hash.service';

// @Global()
// @Module({
//   imports: [
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//         signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
//       }),
//       inject: [ConfigService],
//     }),
//     ThrottlerModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (config: ConfigService) => ({
//         ttl: config.get<number>('THROTTLE_TTL'),
//         limit: config.get<number>('THROTTLE_LIMIT'),
//       }),
//       inject: [ConfigService],
//     }),
//     RedisModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: (config: ConfigService) => ({
//         host: config.get<string>('REDIS_HOST'),
//         port: config.get<number>('REDIS_PORT'),
//       }),
//       inject: [ConfigService],
//     }),
//     SentryModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (config: ConfigService) => ({
//         dsn: config.get<string>('SENTRY_DSN'),
//         environment: config.get<string>('NODE_ENV'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [
//     AuthService,
//     JwtStrategy,
//     HashService,
//     {
//       provide: APP_GUARD,
//       useClass: JwtAuthGuard, // Guard global
//     },
//     {
//       provide: APP_GUARD,
//       useClass: CustomThrottlerGuard, // Throttler global
//     },
//   ],
//   exports: [
//     JwtModule,
//     ThrottlerModule,
//     RedisModule,
//     SentryModule,
//     AuthService,
//     HashService,
//   ],
// })
// export class CommonModule {}
