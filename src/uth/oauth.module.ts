import { GoogleStrategy } from './google.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthController } from './oauth.controller';
import { oauthService } from './oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth } from './entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Oauth])],
  controllers: [OauthController],
  providers: [oauthService, GoogleStrategy],
})
export class oauthModule {}