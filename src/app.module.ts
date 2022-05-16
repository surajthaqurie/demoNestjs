import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

// import { AppController } from './app.controller';
// import { EmployeeModule } from './employee/employee.module';

import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth';
import { Auth2Middleware } from './middleware/auth2';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { PermissionModule } from './permission/permission.module';

// import { PermissionModule } from './permission1/permission.module';
// import { UserPermissionModule } from './user-permission/user-permission.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    }),
    AuthModule,
    UserModule,
    PostModule,
    CategoryModule,
    CommentModule,
    PermissionModule,
    // UserPermissionModule,
    // EmployeeModule
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, Auth2Middleware)
      // .forRoutes('post');
      // .forRoutes(AuthController);
      .exclude({
        path: 'auth/login',
        method: RequestMethod.POST,
      })
      .forRoutes({
        path: 'auth/post',
        method: RequestMethod.GET,
      });
  }
}
