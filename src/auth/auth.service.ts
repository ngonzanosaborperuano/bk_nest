import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Knex } from "knex";
import { Repository } from "typeorm";
import { KNEX } from "../report/knex.provider";
import User from "../user/user.entity";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { UsuarioDto } from "./dto/usuario.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(KNEX) private readonly knex: Knex
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, contrasena } = signUpDto;

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const user = this.usersRepository.create({
      nombre_completo: name,
      email,
      contrasena: hashedPassword,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign({ id: user.id });

    return { token: `${token}` };
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ data: UsuarioDto; success: boolean; message: string }> {
    const { email, contrasena } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = this.jwtService.sign({ id: user.id });
    const userData: UsuarioDto = {
      id: user.id!,
      nombre_completo: user.nombre_completo,
      email: user.email,
      foto: user.foto,
      fecha_creacion: user.fecha_creacion,
      contrasena: user.contrasena,
      session_token: `${token}`,
    };
    return {
      data: userData,
      success: true,
      message: "Usuario logeado exitosamente",
    };
  }

  async search(
    email: string
  ): Promise<{ data: UsuarioDto; success: boolean; message: string }> {
    const result = await this.knex.raw(
      `SELECT * FROM find_usuario_por_email(?)`,
      [email]
    );

    // Verificar si existe el usuario
    if (!result.rows || result.rows.length === 0) {
      const userData: UsuarioDto = {
        id: 0,
        nombre_completo: "",
        email: "",
        foto: "",
        fecha_creacion: "",
        contrasena: "",
      };
      return {
        data: userData,
        success: false,
        message: "Usuario no encontrado",
      };
    }

    const usuario = result.rows[0];

    const userData: UsuarioDto = {
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      foto: usuario.foto,
      fecha_creacion: usuario.fecha_creacion,
      contrasena: usuario.contrasena,
    };

    return {
      data: userData,
      success: true,
      message: "Usuario encontrado exitosamente",
    };
  }
}
