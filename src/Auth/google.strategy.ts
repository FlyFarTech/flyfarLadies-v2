import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Oauth } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor( @InjectRepository(Oauth) private OauthRepo: Repository<Oauth>,) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: 'http://localhost:3000/auth/google-redirect',
      callbackURL: process.env. GOOGLE_OAUTH_REDIRECT,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = new Oauth();
    user.Email = emails[0].value;
    user.firstName = name.givenName;
    user.lastName = name.familyName;
    user.picture = photos[0].value;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
  
    try {
      await this.OauthRepo.save(user);
      done(null, user);
    } catch (error) {
      done(error);
    }
}
}