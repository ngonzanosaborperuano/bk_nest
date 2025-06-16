import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import User from "../../user/user.entity";

// Extractor personalizado para aceptar "Bearer <token>" o solo "<token>"
function customAuthHeaderExtractor(req: any): string | null {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;

  let token = authHeader.trim();

  // Quita 'Bearer ' si existe
  if (token.toLowerCase().startsWith('bearer ')) {
    token = token.slice(7).trim();
  }
  // Quita 'jwt ' si existe
  if (token.toLowerCase().startsWith('jwt ')) {
    token = token.slice(4).trim();
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([customAuthHeaderExtractor]),
      secretOrKey: jwtSecret,
      algorithms: ["HS256"],
    });
  }

  async validate(payload: { id: any }) {
    const { id } = payload;

    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Login first to access this endpoint.");
    }
    // this.logger.log(JSON.stringify(user));
    return user;
  }
}
