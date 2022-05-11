
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '824423766268-cbdmbljgv4j4q1ek3rfrj2gep29hen39.apps.googleusercontent.com',
            clientSecret: `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`,
            callbackURL: 'http://localhost:5000/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}