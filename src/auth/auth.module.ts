import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG_KEYS } from "../common/config/config-keys";
import { ReportsModule } from "../report/reports.module";
import User from "../user/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>(CONFIG_KEYS.JWT.SECRET),
          signOptions: {
            expiresIn: config.get<string>(CONFIG_KEYS.JWT.EXPIRES),
            algorithm: "HS256",
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    ReportsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
