import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput.email, loginInput.password);
  }

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput.email, registerInput.password);
  }

  // Only Managers can create new Store Keeper accounts
  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async createStoreKeeper(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput.email, registerInput.password);
  }
}
