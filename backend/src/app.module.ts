import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UploadsModule } from './uploads/uploads.module';
import { join } from 'path';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
      includeStacktraceInErrorResponses: true,
    }),
    AuthModule,
    ProductsModule,
    UploadsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule { }
