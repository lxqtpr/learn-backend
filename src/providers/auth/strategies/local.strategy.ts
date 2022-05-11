import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import User from '../../../models/user/entity/user.entity'
import { UserService } from '../../../models/user/user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            usernameField: 'email',
        })
    }
    async validate(email: string, password: string): Promise<User> {
        return this.userService.getAuthUser(email, password)
    }
}
