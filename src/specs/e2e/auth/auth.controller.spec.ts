import { Repository } from 'typeorm'
import User from '../../../models/user/entity/user.entity'
import * as request from 'supertest'
import { BadRequestException, INestApplication } from '@nestjs/common'
import { AuthModule } from '../../../providers/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'

describe('Auth', () => {
    let app: INestApplication;
    let repository: Repository<User>;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                AuthModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'postgres',
                    password: 'lxqtpr2021',
                    database: 'nestjs',
                    entities: ['./**/*.entity.ts'],
                    synchronize: true,
                }),
            ],
        }).compile()
        app = module.createNestApplication();
        repository = module.get('UserRepository');
        await app.init();
    })

    afterAll(async () => {
        await app.close();
    });

    describe('POST /registration', function() {
        it('registration"', (done) => {
            request(app.getHttpServer())
                .post('/auth/registration')
                .send({email: 'lxqtpr@gmail.com', password: 'dswqd321'})
                .set('Accept', 'application/json')
                .expect((res) => {expect(res.error).toEqual(new BadRequestException('User with this email already exist'))})
        });
    });
})