import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class StoreKeeperUser {
    @Field() id: string;
    @Field() email: string;
    @Field() role: string;
    @Field() createdAt: Date;
}

@Resolver()
export class UsersResolver {
    constructor(private usersService: UsersService) { }

    @Query(() => [StoreKeeperUser])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.MANAGER)
    async storeKeepers() {
        return this.usersService.findStoreKeepers();
    }
}
