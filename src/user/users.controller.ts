import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { CreateUserDto } from "./dto/user.dto";
import User from "./user.entity";
import { UsersService } from "./users.service";

@ApiTags("Usuario")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<User> {
    const user = await this.usersService.getUserById(Number(id));
    return user;
  }

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    return newUser;
  }

  @Delete(":id")
  async deleteById(@Param("id") id: string): Promise<User | null> {
    const user = await this.usersService.deleteById(Number(id));
    return user;
  }
}
