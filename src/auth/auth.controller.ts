import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import User from "../user/user.entity";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { UsuarioDto } from "./dto/usuario.dto";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}
  @Public()
  @Post("/signup")
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }
  @Public()
  @Post("/login")
  login(
    @Body() loginDto: LoginDto
  ): Promise<{ data: UsuarioDto; success: boolean; message: string }> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post("/logout")
  logout(@Body() user: User): Promise<{ success: boolean; message: string }> {
    return this.authService.logout(user);
  }

  @Public()
  @Get("/correo/:email")
  search(
    @Param("email") email: string
  ): Promise<{ data: UsuarioDto; success: boolean; message: string }> {
    return this.authService.search(email);
  }

  @ApiBearerAuth()
  @Get("/me")
  getProfile(@CurrentUser() user: User) {
    this.logger.log(JSON.stringify(user));
    return user;
  }
}
